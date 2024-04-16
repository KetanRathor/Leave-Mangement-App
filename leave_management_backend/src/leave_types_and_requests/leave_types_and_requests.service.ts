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
    emp_id:number
    
  ): Promise<LeaveRequest> {
    const newRequest = new LeaveRequest();

    // if (!createLeaveDto.emp_id) {
    //   throw new BadRequestException('Employee ID (emp_id) is required');
    // }

    // newRequest.emp_id = createLeaveDto.emp_id;

    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    newLeaveRequest.created_by = req_mail;
    newLeaveRequest.emp_id=emp_id
    const savedLeaveRequest= await this.leaveRequestRepository.save(newLeaveRequest);
    try{

      const employee = await this.employeeRepository.findOne({
        where: { id: emp_id},
        relations: ['manager'], 
      });
  
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
  
      const managerEmail = employee.manager?.email; 
      console.log("managerEmail:",managerEmail)
  
      if (!managerEmail) {
        console.warn('Manager email not found for employee:', employee.id);
      } else {
        console.log("req_mail",req_mail,"managerEmail",managerEmail)
        await this.mailService.sendLeaveRequestEmail(req_mail, managerEmail, createLeaveDto.reason);
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
    let remainingBalance = 21;
    
    approvedRequests.forEach((request) => {
      switch (request.leave_type) {
        case 'full':
          remainingBalance -= 1;
          break;
        case 'first half':
        case 'second half':
          remainingBalance -= 0.5;
          break;
        
      }
    });

    return remainingBalance;

  } catch (error) {
    throw new BadRequestException('Failed to calculate remaining leave balance');
  }
}


//work-from-hme
async getRemainingLeaveBalanceforworkfromhome(id: number): Promise<number> {
  try {
    const approvedRequests = await this.leaveRequestRepository.find({
      where: {
        emp_id: id, 
        status: 'approved',
      },
    });
    let remainingworkfromhome= 3;

    approvedRequests.forEach((request) => {
      switch (request.leave_type) {
          case 'work from home':
            remainingworkfromhome -=1;
            break;
        
      }
    });
    return remainingworkfromhome;

  } catch (error) {
    throw new BadRequestException('Failed to calculate remaining leave balance');
  }
}

}

