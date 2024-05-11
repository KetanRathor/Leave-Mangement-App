import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { start } from 'repl';
import { Console } from 'console';
import { MailService } from 'src/mail/mail.service';
import { Employee } from 'src/employee/entities/Employee.entity';

@Injectable()
export class LeaveTypesAndRequestsService {
  // private readonly leaveTypes = [
  //   { leave_type_id: 1,
  //      leave_type_name: 'full',
  //       default_balance: 21 },
  //   {
  //     leave_type_id: 2,
  //     leave_type_name: 'first half',
  //     default_balance: 10,
  //   },
  //   {
  //     leave_type_id: 3,
  //     leave_type_name: 'second half',
  //     default_balance: 10,
  //   },
  //   {
  //     leave_type_id: 4,
  //     leave_type_name: 'work from home',
  //     default_balance: 10,
  //   },
  // ];

  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    private readonly mailService: MailService, // Inject MailService
    @InjectRepository(Employee) // Inject Employee repository
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
    req_mail: string,
    emp_id: number,
  ): Promise<LeaveRequest> {
    const newRequest = new LeaveRequest();

    // if (!createLeaveDto.emp_id) {
    //   throw new BadRequestException('Employee ID (emp_id) is required');
    // }

    // newRequest.emp_id = createLeaveDto.emp_id;

    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    newLeaveRequest.created_by = req_mail;
    
    newLeaveRequest.emp_id = emp_id
    const savedLeaveRequest = await this.leaveRequestRepository.save(newLeaveRequest);
    const employee = await this.employeeRepository.findOne({ where: { email: req_mail } });
  const employeeName = employee ? employee.name : "Unknown";
  const fromDateAndStartDate = `${createLeaveDto.start_date} to ${createLeaveDto.end_date}`
  
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: emp_id },
        relations: ['manager'],
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const managerEmail = employee.manager?.email;
      console.log('managerEmail:', managerEmail);

      if (!managerEmail) {
        console.warn('Manager email not found for employee:', employee.id);
      } else {
        console.log("req_mail", req_mail, "managerEmail", managerEmail)
        await this.mailService.sendLeaveRequestEmail(req_mail, managerEmail, createLeaveDto.reason, employeeName,fromDateAndStartDate);
      }
      return savedLeaveRequest;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw new InternalServerErrorException('Error creating leave request');
    }
  }

  findOne(id: number): Promise<LeaveRequest> {
    console.log(id);
    return this.leaveRequestRepository.findOneBy({ id });
  }

  async findAllByEmployeeId(emp_id: number): Promise<LeaveRequest[]> {
    return await this.leaveRequestRepository.find({
      where: { emp_id }, // Filter by employeeId
      relations: ['employee'], // Include related employee information (optional)
    });
  }

  //  async findOne(id: number): Promise<LeaveRequest> {
  //     console.log(id);
  //     const rrr= await this.leaveRequestRepository.find({where:{id}, relations: ['employee']});
  //     return rrr;
  //   }

  // async findOne(id: number): Promise<LeaveRequest | undefined> {
  //   try {
  //     const request = await this.leaveRequestRepository.findOne({
  //       where: { id }, // Clear object property syntax
  //       relations: ['employee'], // Include related employee information if needed
  //     });

  //     if (!request) { // Handle case where request is not found
  //       return undefined;
  //     }

  //     return request;
  //   } catch (error) {
  //     console.error('Error fetching leave request:', error);
  //     // Handle the error appropriately (e.g., throw, log)
  //   }
  // }

  findAll() {
    return this.leaveRequestRepository.find({ relations: ['employee'] });
  }

 

  async updateStatus(
    leave_request_id: number,
    status: string,
    req_mail: string,
  ): Promise<{ leaveRequest: LeaveRequest, message: string }> {
    const leaveRequest = await this.findOne(leave_request_id);
    leaveRequest.status = status;
    leaveRequest.updated_by = req_mail;
    const employee = await this.employeeRepository.findOne({ where: { email: req_mail } });
  const employeeName = employee ? employee.name : "Unknown";
  
  const employeeEmail = leaveRequest.created_by;
  const updatedLeaveRequest = await this.leaveRequestRepository.save(leaveRequest);
    const message = `Your leave request has been ${status} by ${employeeName}.`;
    if (updatedLeaveRequest) {
      await this.mailService.sendLeaveStatusEmail(employeeEmail, message); 
    }

    return { leaveRequest: updatedLeaveRequest, message };
  }

  
  async getLeaveRequest(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({ id });
    if (!leaveRequest) {
      throw new BadRequestException('No Leave Request Found');
    }
    return leaveRequest;
  }

  async getEmployeesWithPendingLeaveRequests(): Promise<
    {
      employeeName: string;
      start_date: Date;
      end_date: Date;
      leave_type: string;
      reason: string;
    }[]
  > {
    try {
      const pendingRequests = await this.leaveRequestRepository.find({
        where: {
          status: 'pending',
        },
        relations: ['employee'],
      });

      return pendingRequests.map((request) => ({
        employeeName: request.employee.name,
        start_date: request.start_date,
        end_date: request.end_date,
        leave_type: request.leave_type,
        reason: request.reason,
      }));
    } catch (error) {
      console.error('Error fetching employees with pending requests:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  


  async getRemainingLeaveBalance(id: number): Promise<any> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear =
        currentMonth >= 3
          ? currentDate.getFullYear()
          : currentDate.getFullYear() - 1; // Adjust year based on current month
      const approvedRequests = await this.leaveRequestRepository.find({
        where: {
          emp_id: id,
          status: 'approved',
        },
      });

      let default_balance = 21;
      let remainingBalance = default_balance;

      approvedRequests.forEach((request) => {
        const startDate = new Date(request.start_date);
        const endDate = request.end_date ? new Date(request.end_date) : null; // Convert end date if provided

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();

        if (startYear === currentYear && startMonth >= 3) {
          // Check if leave started after 1st April of current year
          let daysDifference: number;
          if (endDate) {
            const millisecondsPerDay = 1000 * 60 * 60 * 24;
            const differenceInMilliseconds =
              endDate.getTime() - startDate.getTime();
            daysDifference =
              Math.ceil(differenceInMilliseconds / millisecondsPerDay) + 1;
          } else {
            daysDifference = 1;
          }

          switch (request.leave_type) {
            case 'full':
              remainingBalance -= daysDifference;
              break;
            case 'first half':
            case 'second half':
              remainingBalance -= daysDifference / 2;
              break;
            default:
              break;
          }
        }
      });

      remainingBalance = Math.max(remainingBalance, 0);

      return {
        remainingBalance: remainingBalance,
        default_balance: default_balance,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to calculate remaining leave balance',
      );
    }
  }



async getRemainingLeaveBalanceforworkfromhome(id: number): Promise<any> {
  try {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const approvedRequests = await this.leaveRequestRepository.find({
      where: {
        emp_id: id,
        status: 'approved',
        leave_type: 'work from home',
      },
    });

    const defaultBalancePerMonth: number[] = new Array(12).fill(3);

    approvedRequests.forEach((request) => {
      const startDate = new Date(request.start_date);
      const endDate = request.end_date ? new Date(request.end_date) : null;

      const startMonth = startDate.getMonth();
      const startYear = startDate.getFullYear();
      const endMonth = endDate ? endDate.getMonth() : null;
      const endYear = endDate ? endDate.getFullYear() : null;

      let startDay = startDate.getDate();
      let endDay = endDate ? endDate.getDate() : null;

      if (startYear === currentYear) {
        if (startMonth === currentMonth) {
          if (endMonth === currentMonth) {
            defaultBalancePerMonth[currentMonth] -= endDay - startDay + 1;
          } else {
            const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate(); // Number of days in start month
            defaultBalancePerMonth[currentMonth] -= daysInStartMonth - startDay + 1;
          }
        } else if (endMonth === currentMonth) {
          defaultBalancePerMonth[currentMonth] -= endDay;
        }
      }
    });

    let remainingWorkFromHomeBalance = Math.max(defaultBalancePerMonth[currentMonth], 0);

    return { remainingBalance: remainingWorkFromHomeBalance, defaultBalance: 3 };
  } catch (error) {
    throw new BadRequestException('Failed to calculate remaining work from home balance');
  }
}


  
  

  // async getEmployeesOnLeaveToday(): Promise<any> {
  //   try {
  //     const today = new Date();
  
  //     const leaveRequests = await this.leaveRequestRepository.find({
  //       where: {
  //         status: 'approved',
  //         start_date: Between(new Date(today.setHours(0, 0, 0, 0)), new Date(today.setHours(23, 59, 59, 999))),
  //       },
  //       relations: ['employee'], 
        
  //     });
  //     console.log("leaveRequests",leaveRequests)
  
  //     // return leaveRequests.map((leaveRequest) => leaveRequest.employee);
  //     return leaveRequests.map((leaveRequest) => ({
  //       // employee: leaveRequest.employee,
  //       leaveRequest: leaveRequest,
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching employees on leave today:', error);
  //     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  
  async getEmployeesOnLeaveToday(): Promise<any> {
    try {
        const today = new Date();

        const leaveRequests = await this.leaveRequestRepository.find({
            where: { status: 'approved' },
            // select: ['start_date', 'end_date'],
        });

        console.log("leaveRequests", leaveRequests);

        const filteredLeaveRequests = leaveRequests.filter((leaveRequest) => {
            const startDate = new Date(leaveRequest.start_date);
            const endDate = new Date(leaveRequest.end_date);
            return today >= startDate && today <= endDate;
        });

        if (filteredLeaveRequests.length === 0) {
            console.log("No employees are on leave today.");
            return "No employees are on leave today.";
        }

        const employeeDetails = await Promise.all(
            filteredLeaveRequests.map(async (leaveRequest) => {
                const employee = await this.employeeRepository.findOne({
                    where: { id: leaveRequest.emp_id },
                });
                return { ...leaveRequest, employee };
            })
        );

        console.log("employeesOnLeaveToday", employeeDetails);

        return employeeDetails;
    } catch (error) {
        console.error('Error fetching employees on leave today:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


async findAllRequestsByEmployeeId(emp_id: number): Promise<Employee[]> {

  if(emp_id )
  return await this.employeeRepository.find({
    where: [
      { manager_id: emp_id },
    ],
  });
}

async findPendingRequestsByEmployeeId(employeeId: number): Promise<LeaveRequest[]> {
  return this.leaveRequestRepository.find({
    where: { emp_id:employeeId, status: 'pending' },
    relations: ['employee'],
  });
}

}

