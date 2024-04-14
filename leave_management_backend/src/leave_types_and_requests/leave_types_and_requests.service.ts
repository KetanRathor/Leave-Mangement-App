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
import { HolidaysService } from 'src/holidays/holidays.service';
// import { Employee } from 'src/employee/entities/Employee.entity';
// import { LeaveType } from './entities/LeaveType.entity';
// import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
// import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypesAndRequestsService {
  private readonly leaveTypes = [
    { leave_type_id: 1, leave_type_name: 'full', default_balance: 21},
    { leave_type_id: 4, leave_type_name: 'work from home', default_balance: 10},
  ];
  // updateStatus(leave_request_id: number, status: string): any {
  //   throw new Error('Method not implemented.');
  // }
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    private readonly holidaysService: HolidaysService,
    // @InjectRepository(LeaveType)
    // private readonly leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
    req_mail: string,
  ): Promise<LeaveRequest> {
    const newRequest = new LeaveRequest();

    if (!createLeaveDto.emp_id) {
      throw new BadRequestException('Employee ID (emp_id) is required');
    }
    // if (!createLeaveDto.leave_type_id) {
    //   throw new BadRequestException('Leave Type Id is required');
    // }

    newRequest.emp_id = createLeaveDto.emp_id;

    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    newLeaveRequest.created_by = req_mail;
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
    req_mail:string,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(leave_request_id);
    leaveRequest.status = status;
    leaveRequest.updated_by=req_mail;
    return this.leaveRequestRepository.save(leaveRequest);
  }
  async getLeaveRequest(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({ id });
    if (!leaveRequest) {
      throw new BadRequestException('No Leave Request Found');
    }
    return leaveRequest;
  }

  // async getBalanceLeaves(emp_id: number, leave_type_id: number): Promise<number> {
  //   const leaveType = await this.leaveTypeRepository.findOneBy({ leave_type_id });
  //   if (!leaveType) {
  //     throw new Error('Invalid leave type');
  //   }

  //   const approvedRequests = await this.leaveRequestRepository.find({
  //     where: {
  //       leave_type_id: leave_type_id,
  //       status: 'approved',
  //       emp_id: emp_id
  //     },
  //     relations: ['employee'],
  //   });

  //   const employeeRequests = approvedRequests.filter(
  //     (request) => request.employee.emp_id === emp_id
  //   );

  //   const totalDaysTaken = employeeRequests.reduce((total, request) => {
  //     const days = ((new Date(request.start_date)).getTime() - (new Date(request.end_date)).getTime()) / (1000 * 60 * 60 * 24);
  //     // const days = (request.end_date as Date).getTime() - request.start_date.getTime() / (1000 * 60 * 60 * 24);

  //     return total - days;
  //   }, 0);

  //   return leaveType.default_balance - totalDaysTaken;
  // }

  // async getPendingLeaveRequests(): Promise<{ id: number, status: string, }[]> {
  //   const pendingRequests = await this.leaveRepository.find({ where: { status: 'pending' } });
  //   return pendingRequests.map(request => ({ id: request.emp_id, status: request.status }));
  // }

  // async getBalanceLeaves(
  //   emp_id: number,
  //   leave_type_id: number,
  // ): Promise<number> {
  //   const leaveType = this.leaveTypes.find(
  //     (type) => type.leave_type_id === leave_type_id,
  //   );
  //   if (!leaveType) {
  //     throw new Error('Invalid leave type');
  //   }

  //   const approvedRequests = await this.leaveRequestRepository.find({
  //     where: {
  //       id: leave_type_id,
  //       status: 'approved',
  //       emp_id: emp_id,
  //     },
  //     relations: ['employee'],
  //   });

  //   const employeeRequests = approvedRequests.filter(
  //     (request) => request.employee.id === emp_id,
  //   );

  //   const totalDaysTaken = employeeRequests.reduce((total, request) => {
  //     const days =
  //       (new Date(request.start_date).getTime() -
  //         new Date(request.end_date).getTime()) /
  //       (1000 * 60 * 60 * 24);
  //     // const days = (request.end_date as Date).getTime() - request.start_date.getTime() / (1000 * 60 * 60 * 24);

  //     return total - days;
  //   }, 0);

  //   return leaveType.default_balance - totalDaysTaken;
  // }


  // async calculateLeaveBalance(emp_id: number, leaveTypes: any[]) {
  //   const leaveBalances = [];
  
  //   for (const leaveType of leaveTypes) {
  //     let totalDaysTaken = 0;
  
  //     // Simulate fetching approved leave requests (replace with actual data source if needed)
  //     const approvedRequests = [
  //       // Example data: replace with actual data from your system
  //       { leave_type_id: leaveType.leave_type_id, duration: 0.5 }, // First half day
  //       { leave_type_id: leaveType.leave_type_id, duration: 1 }, // Full day
  //     ];
  
  //     for (const request of approvedRequests) {
  //       totalDaysTaken += request.duration;
  //     }
  
  //     const remainingBalance = leaveType.default_balance - totalDaysTaken;
  
  //     leaveBalances.push({
  //       leaveTypeName: leaveType.leave_type_name,
  //       remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
  //     });
  //   }
  
  //   return leaveBalances;
  // }
  

  async getEmployeesWithPendingLeaveRequests(): Promise<
    { employeeId: number; employeeName: string }[]
  > {
    try {
      const pendingRequests = await this.leaveRequestRepository.find({
        where: {
          status: 'pending',
        },
        relations: ['employee'],
      });

      const employeesWithPendingRequests = pendingRequests.map((request) => ({
        employeeId: request?.employee?.id,
        employeeName: request?.employee?.name,
      }));

      return employeesWithPendingRequests.filter(
        (emp, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.employeeId === emp.employeeId &&
              t.employeeName === emp.employeeName,
          ),
      );
    } catch (error) {
      console.error('Error fetching employees with pending requests:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async createLeaveType(leaveTypeDetails: CreateLeaveTypeDto): Promise<LeaveType> {
  //   const newLeaveType = await this.leaveTypeRepository.create(leaveTypeDetails)
  //   return await this.leaveTypeRepository.save(newLeaveType);
  // }

  // async updateLeaveType(leave_type_id: number, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
  //   const leaveType = await this.leaveTypeRepository.findOne({
  //     where: {
  //       leave_type_id: leave_type_id
  //     }
  //   })

  //   leaveType.leave_type_name = updateLeaveTypeDto.leave_type_name;
  //   leaveType.default_balance = updateLeaveTypeDto.default_balance;

  //   return await this.leaveTypeRepository.save({
  //     ...leaveType,
  //     leave_type_id
  //   });
  // }

  // async getLeaveTypes(): Promise<LeaveType[]> {
  //   const leaveTypes = await this.leaveTypeRepository.find();
  //   if(!leaveTypes){
  //     throw new BadRequestException("No Leave Types")
  //   }
  //   return leaveTypes;
  // }

  async getRemainingLeave(emp_id: number): Promise<{ leave_type_name: string; remaining_balance: number, total_leave:number }[]> {
    const approvedRequests = await this.leaveRequestRepository.find({
      where: {
        emp_id,
        status: 'approved',
      },
    });
  
    const fullLeaveType = this.leaveTypes.find((leaveType) => leaveType.leave_type_name === 'full');
    if (!fullLeaveType) {
      throw new Error('Missing leave type: full');
    }
  
    const workFromHomeLeaveType = this.leaveTypes.find((leaveType) => leaveType.leave_type_name === 'work from home');
    if (!workFromHomeLeaveType) {
      throw new Error('Missing leave type: work from home');
    }
  
    const totalFullDaysTaken = approvedRequests.reduce((total, request) => {
      const days = this.calculateDays(request.start_date, request.end_date);
      const isFullDay = request.leave_type === 'full';
      const isHalfDay = request.leave_type === 'first half' || request.leave_type === 'second half';
      const leaveTaken = isFullDay ? days : (isFullDay || isHalfDay) ? days / 2 : 0;
      return total + leaveTaken;
    }, 0);
  
    const totalWorkFromHomeDaysTaken = approvedRequests.reduce((total, request) => {
      const days = this.calculateDays(request.start_date, request.end_date);
      return total + (request.leave_type === 'work from home' ? days : 0); 
    }, 0);
  
    const remainingFullBalance = Math.max(0, fullLeaveType.default_balance - totalFullDaysTaken);
    const remainingWorkFromHomeBalance = Math.max(0, workFromHomeLeaveType.default_balance - totalWorkFromHomeDaysTaken);
  
    return [
      {
        leave_type_name: 'full',
        remaining_balance: remainingFullBalance,
        total_leave: fullLeaveType.default_balance,
      },
      {
        leave_type_name: 'work from home',
        remaining_balance: remainingWorkFromHomeBalance,
        total_leave: workFromHomeLeaveType.default_balance,
        
      },
    ];
  }
  
  private calculateDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
  }
}
