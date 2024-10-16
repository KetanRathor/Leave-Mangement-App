import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { start } from 'repl';
import { Console } from 'console';


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
  ) {}

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
    req_mail: string,
    emp_id:number,
  ): Promise<LeaveRequest> {
    
    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    newLeaveRequest.created_by = req_mail;
    newLeaveRequest.emp_id = emp_id;
    return await this.leaveRequestRepository.save(newLeaveRequest);
  }
  findOne(id: number): Promise<LeaveRequest> {
    console.log(id);
    return this.leaveRequestRepository.findOneBy({ id });
  }

  findAll() {
    return this.leaveRequestRepository.find({ relations: ['employee'] });
  }

  async updateStatus(
    leave_request_id: number,
    status: string,
    req_mail: string,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(leave_request_id);
    leaveRequest.status = status;
    leaveRequest.updated_by = req_mail;
    return this.leaveRequestRepository.save(leaveRequest);
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
    const approvedRequests = await this.leaveRequestRepository.find({
      where: {
        emp_id: id, 
        status: 'approved',
      },
    });
    

    let totalFullDays=0
    let totalHalfDays=0
    approvedRequests.forEach((request) => {
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (request.leave_type) {
        case 'full':
          totalFullDays += daysDifference;
          break;
        case 'first half':
        case 'second half':
          totalHalfDays += daysDifference;
          break;
        default:
          break;
      }
    });
    
    let remainingBalance = 21;
    approvedRequests.forEach((request) => {
      switch (request.leave_type) {
        case 'full':
          remainingBalance -= totalFullDays;
          break;

        case 'first half':
        case 'second half':
          remainingBalance -= totalHalfDays/2;
          break;
      }
    });

    return remainingBalance;

  } catch (error) {
    throw new BadRequestException('Failed to calculate remaining leave balance');
  }
}


//work-from-hme

// async getRemainingLeaveBalanceforworkfromhome(id: number): Promise<number> {
//   try {
//     const approvedRequests = await this.leaveRequestRepository.find({
//       where: {
//         emp_id: id, 
//         status: 'approved',
//         leave_type: 'work from home',
//       },
//     });

//     let totalWorkFromHomeDays = 0;
//     approvedRequests.forEach((request) => {
//       const startDate = new Date(request.start_date);
//       const endDate = new Date(request.end_date);
//       const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
//       totalWorkFromHomeDays += daysDifference;
//     });

//     const defaultBalance = 3;
//     let remainingWorkFromHomeBalance = defaultBalance - totalWorkFromHomeDays;

//     if (remainingWorkFromHomeBalance < 0) {
//       remainingWorkFromHomeBalance = 0;
//     }

//     return remainingWorkFromHomeBalance;
//   } catch (error) {
//     throw new BadRequestException('Failed to calculate remaining leave balance');
//   }
// }


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

}

