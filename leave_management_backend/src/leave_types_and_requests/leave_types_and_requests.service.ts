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
    private readonly mailService: MailService, 
    @InjectRepository(Employee) 
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
    req_mail: string,
    emp_id: number

  ): Promise<LeaveRequest> {

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
      console.log("managerEmail:", managerEmail)

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
      where: { emp_id }, 
      // relations: ['employee'],
    });
  }


  findAll() {
    return this.leaveRequestRepository.find({
      // relations: ['employee'] 
    });
  }

  // async updateStatus(
  //   leave_request_id: number,
  //   status: string,
  //   req_mail: string,
  // ): Promise<LeaveRequest> {
  //   const leaveRequest = await this.findOne(leave_request_id);
  //   leaveRequest.status = status;
  //   leaveRequest.updated_by = req_mail;
  //   return this.leaveRequestRepository.save(leaveRequest);
  // }

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

    const updatedLeaveRequest = await this.leaveRequestRepository.save(leaveRequest);
    const message = `Your leave request has been ${status} by ${employeeName}.`;
    if (updatedLeaveRequest) {
      await this.mailService.sendLeaveStatusEmail(req_mail, message); 
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

  async getEmployeesWithPendingLeaveRequests(): Promise<{
    employeeName: string;
    start_date: Date;
    end_date: Date;
    leave_type: string;
    reason: string;
  }[]> {
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

  


async getRemainingLeaveBalance(id: number): Promise<number> {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const approvedRequests = await this.leaveRequestRepository.find({
      where: {
        emp_id: id,
        status: 'approved',
      },
    });

    let remainingBalance = 21;

    approvedRequests.forEach((request) => {
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      const leaveType = request.leave_type;

      const startYear = startDate.getFullYear();

      if (startYear === currentYear) {
        const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (leaveType) {
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

    return remainingBalance;
  } catch (error) {
    throw new BadRequestException('Failed to calculate remaining leave balance');
  }
}


  async getRemainingLeaveBalanceforworkfromhome(id: number): Promise<number> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const approvedRequests = await this.leaveRequestRepository.find({
        where: {
          emp_id: id,
          status: 'approved',
          leave_type: 'work from home',
        },
      });

      let totalWorkFromHomeDays = 0;

      approvedRequests.forEach((request) => {
        const startDate = new Date(request.start_date);
        const endDate = new Date(request.end_date);

        const startMonth = startDate.getMonth();
        const startYear = startDate.getFullYear();

        if (startMonth === currentMonth && startYear === currentYear) {
          const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          totalWorkFromHomeDays += daysDifference;
        }
      });

      const defaultBalance = 3;
      let remainingWorkFromHomeBalance = defaultBalance - totalWorkFromHomeDays;

      remainingWorkFromHomeBalance = Math.max(remainingWorkFromHomeBalance, 0);

      return remainingWorkFromHomeBalance;
    } catch (error) {
      throw new BadRequestException('Failed to calculate remaining leave balance');
    }
  }


  // async getNumberOfEmployeesOnLeaveToday(): Promise<number> {
  //   try {
  //     const today = new Date();
  //     // const year = today.getFullYear();
  //     // const month = today.getMonth() + 1; 
  //     // const day = today.getDate();
  
  //     const leaveRequests = await this.leaveRequestRepository.find({
  //       where: {
  //         status: 'approved',
  //         start_date: LessThanOrEqual(today),
  //         end_date: GreaterThanOrEqual(today),
  //       },
  //     });
  
  //     return leaveRequests.length;
  //   } catch (error) {
  //     console.error('Error fetching number of employees on leave today:', error);
  //     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
  // async getNumberOfEmployeesOnLeaveToday(): Promise<number> {
  //   try {
  //     const today = new Date();
  
  //     const leaveRequests = await this.leaveRequestRepository.find({
  //       where: {
  //         status: 'approved',
  //         start_date: Between(new Date(today.setHours(0, 0, 0, 0)), new Date(today.setHours(23, 59, 59, 999))),
  //       },
  //     });
  
  //     return leaveRequests.length;
  //   } catch (error) {
  //     console.error('Error fetching number of employees on leave today:', error);
  //     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async getEmployeesOnLeaveToday(): Promise<any> {
    try {
      const today = new Date();
  
      const leaveRequests = await this.leaveRequestRepository.find({
        where: {
          status: 'approved',
          start_date: Between(new Date(today.setHours(0, 0, 0, 0)), new Date(today.setHours(23, 59, 59, 999))),
        },
        relations: ['employee'], 
        
      });
      console.log("leaveRequests",leaveRequests)
  
      // return leaveRequests.map((leaveRequest) => leaveRequest.employee);
      return leaveRequests.map((leaveRequest) => ({
        // employee: leaveRequest.employee,
        leaveRequest: leaveRequest,
      }));
    } catch (error) {
      console.error('Error fetching employees on leave today:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

}

