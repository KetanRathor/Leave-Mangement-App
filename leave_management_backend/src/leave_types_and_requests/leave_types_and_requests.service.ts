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
import { Between, In, LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { start } from 'repl';
import { Console, log } from 'console';
import { MailService } from 'src/mail/mail.service';
import { Employee } from 'src/employee/entities/Employee.entity';
import { ClientGrpcProxy } from '@nestjs/microservices';

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
    private readonly mailService: MailService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
    req_mail: string,
    emp_id: number,
  ): Promise<LeaveRequest> {
    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    newLeaveRequest.created_by = req_mail;

    newLeaveRequest.emp_id = emp_id;
    const savedLeaveRequest =
      await this.leaveRequestRepository.save(newLeaveRequest);
    const employee = await this.employeeRepository.findOne({
      where: { email: req_mail },
    });
    const employeeName = employee ? employee.name : 'Unknown';
    const fromDateAndStartDate = `${createLeaveDto.start_date} to ${createLeaveDto.end_date}`;

    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: emp_id },
        relations: ['manager'],
      });
      console.log('Employee', employee);

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const managerEmail = employee.manager?.email;
      console.log('managerEmail:', managerEmail);

      if (!managerEmail) {
        console.warn('Manager email not found for employee:', employee.id);
      } else {
        console.log('req_mail', req_mail, 'managerEmail', managerEmail);
        await this.mailService.sendLeaveRequestEmail(
          req_mail,
          managerEmail,
          createLeaveDto.reason,
          employeeName,
          fromDateAndStartDate,
        );
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
      where: { emp_id },
      // relations: ['employee'],
    });
  }

  findAll() {
    return this.leaveRequestRepository.find({
      // relations: ['employee']
    });
  }
  async updateStatus(
    leave_request_id: number,
    status: string,
    req_mail: string,
  ): Promise<{ leaveRequest: LeaveRequest; message: string }> {
    const leaveRequest = await this.findOne(leave_request_id);
    leaveRequest.status = status;
    leaveRequest.updated_by = req_mail;
    const employee = await this.employeeRepository.findOne({
      where: { email: req_mail },
    });
    const employeeName = employee ? employee.name : 'Unknown';

    // const employeeId = await this.employeeRepository.findOne({ where: { email: leaveRequest.created_by } });

    // if (!employeeId) {
    //   throw new Error(`Employee with email ${leaveRequest.created_by} not found`);
    // }
    const employeeEmail = leaveRequest.created_by;
    // console.log("employeeId",employeeId.email)

    const updatedLeaveRequest =
      await this.leaveRequestRepository.save(leaveRequest);
    
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

  // async getEmployeesWithPendingLeaveRequests(): Promise<{
  //   employeeName: string;
  //   start_date: Date;
  //   end_date: Date;
  //   leave_type: string;
  //   reason: string;
  // }[]> {
  //   try {
  //     const pendingRequests = await this.leaveRequestRepository.find({
  //       where: {
  //         status: 'pending',
  //       },
  //       relations: ['employee'],
  //     });

  //     return pendingRequests.map((request) => ({
  //       employeeName: request.employee.name,
  //       start_date: request.start_date,
  //       end_date: request.end_date,
  //       leave_type: request.leave_type,
  //       reason: request.reason,
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching employees with pending requests:', error);
  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  async getEmployeesWithPendingLeaveRequests(): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: { status: 'pending' },
      relations: ['employee'],
    });
  }

  
  // async getEmployeesWithPendingLeaveRequests(): Promise<
  //   {
  //     id: Number;
  //     emp_id: Number;
  //     employeeName: string;
  //     start_date: Date;
  //     end_date: Date;
  //     leave_type: string;
  //     reason: string;
  //   }[]
  // > {
  //   try {
  //     const pendingRequests = await this.leaveRequestRepository.find({
  //       where: {
  //         status: 'pending',
  //       },
  //       relations: ['employee'],
  //     });

  //     return pendingRequests.map((request) => ({
  //       id: request.id,
  //       emp_id: request.employee.id,
  //       employeeName: request.employee.name,
  //       start_date: request.start_date,
  //       end_date: request.end_date,
  //       leave_type: request.leave_type,
  //       reason: request.reason,
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching employees with pending requests:', error);
  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  
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

      const defaultBalancePerMonth: number[] = new Array(12).fill(3); // Initialize array to hold default balance for each month with 3 for work from home

      approvedRequests.forEach((request) => {
        const startDate = new Date(request.start_date);
        const endDate = request.end_date ? new Date(request.end_date) : null;
    
        const startMonth = startDate.getMonth();
        const startYear = startDate.getFullYear();
        const endMonth = endDate ? endDate.getMonth() : null;
        const endYear = endDate ? endDate.getFullYear() : null;
    
        let startDay = startDate.getDate();
        let endDay = endDate ? endDate.getDate() : null;
    
        if (startYear === currentYear && startMonth === currentMonth) {
            if (endDate === null || (endMonth !== null && endMonth === currentMonth && endDate.getTime() === startDate.getTime())) {
                // If end date is null or end date is in the same month and same as start date (one-day leave)
                defaultBalancePerMonth[currentMonth] -= 1; // Subtract only 1 day
            } else if (endMonth === currentMonth) {
                defaultBalancePerMonth[currentMonth] -= endDay - startDay + 1; // Subtract the difference between end and start day, plus 1
            } else {
                // If end month is different from current month
                const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
                defaultBalancePerMonth[currentMonth] -= daysInStartMonth - startDay + 1; // Subtract remaining days in the start month
            }
        }
    });
    
    

      // Calculate remaining balance for the current month
      let remainingWorkFromHomeBalance = Math.max(
        defaultBalancePerMonth[currentMonth],
        0,
      );

      return {
        remainingBalance: remainingWorkFromHomeBalance,
        defaultBalance: 3,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to calculate remaining work from home balance',
      );
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

//   async getEmployeesOnLeaveToday(): Promise<any> {
//     try {
//         const today = new Date();

//         const leaveRequests = await this.leaveRequestRepository.find({
//             where: { status: 'approved' },
//             // select: ['start_date', 'end_date'],
//         });

//         // console.log("leaveRequests", leaveRequests);

//         const filteredLeaveRequests = leaveRequests.filter((leaveRequest) => {
//             const startDate = new Date(leaveRequest.start_date);
//             const endDate = leaveRequest.end_date?new Date(leaveRequest.end_date):null;
//             // return today >= startDate && today <= endDate;
//             if (endDate==null && startDate.toDateString() === today.toDateString()) {
//               return true;
//             }
//             return (today >= startDate && today <= endDate);
      
//         });
//         // console.log(filteredLeaveRequests )
//         if (filteredLeaveRequests.length === 0) {
//             console.log("No employees are on leave today.");
//             return "No employees are on leave today.";
//         }

//         const employeeDetails = await Promise.all(
//             filteredLeaveRequests.map(async (leaveRequest) => {
//                 const employee = await this.employeeRepository.findOne({
//                     where: { id: leaveRequest.emp_id },
//                 });
//                 return { ...leaveRequest, employee };
//             })
//         );

//         console.log("employeesOnLeaveToday", employeeDetails);

//         return employeeDetails;
//     } catch (error) {
//         console.error('Error fetching employees on leave today:', error);
//         throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
// }

  async findAllRequestsByEmployeeId(emp_id: number): Promise<Employee[]> {
    if (emp_id)
      return await this.employeeRepository.find({
        where: [{ manager_id: emp_id }],
      });
  }

  async findPendingRequestsByEmployeeId(
    employeeId: number,
  ): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: { emp_id: employeeId, status: 'pending' },
      relations: ['employee'],
    });
  }



  async getEmployeesOnLeaveToday(managerId: number,role:string): Promise<Employee[]> {

    try {
      const today = new Date();
      const leaveRequests = await this.leaveRequestRepository.find({
        where: { status: 'approved' },
        relations: ['employee'],
      });
       
      const filteredLeaveRequests = leaveRequests.filter((leaveRequest) => {
        const startDate = new Date(leaveRequest.start_date);
        const endDate = leaveRequest.end_date?new Date(leaveRequest.end_date):null;
        // console.log(endDate)
        // return (today >= startDate && today <= endDate);
        console.log(role)

        if (role=='Admin'){
          return (endDate == null && startDate.toDateString() === today.toDateString()
        || (today >= startDate && today <= endDate)) 
        }
        else{
        return (endDate == null && startDate.toDateString() === today.toDateString()
        || (today >= startDate && today <= endDate)) 
        && leaveRequest.employee.manager_id === managerId;}
});
      const employeesOnLeaveToday: any[] = filteredLeaveRequests.map((leaveRequest) => {
        return {
            // employee: leaveRequest.employee,
            leaveRequest
        };
    });
      return employeesOnLeaveToday;

    
    } catch (error) {
      console.error('Error fetching employees on leave today:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  
}
