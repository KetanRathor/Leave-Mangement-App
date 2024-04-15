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
    { leave_type_id: 1, leave_type_name: 'full', default_balance: 21 },
    { leave_type_id: 4, leave_type_name: 'work from home', default_balance: 10 },
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
  ) { }

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

  async getRemainingLeave(emp_id: number): Promise<{ leave_type_name: string; remaining_balance: number, total_leave: number }[]> {
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
    const holidays = await this.holidaysService.getHolidayCounts();

    const result = [
      {
        leave_type_name: 'full',
        remaining_balance: remainingFullBalance,
        total_leave: fullLeaveType.default_balance,
      },
      {
        leave_type_name: 'work from home',
        remaining_balance: remainingWorkFromHomeBalance,
        total_leave: workFromHomeLeaveType.default_balance,
      }
    ];

    // const oneYearHoliday = holidays.total_holidays + fullLeaveType.default_balance;
    // const holidayOver = (holidays.total_holidays-holidays.recent_holidays) + remainingFullBalance;
    const oneYearHoliday = holidays.total_holidays;
    const holidayOver = holidays.total_holidays-holidays.recent_holidays;

    const holidayCount = {
      leave_type_name: 'Annual Leave',
      remaining_balance: holidayOver,
      total_leave: oneYearHoliday,
    }

    result.push(holidayCount)
    return result
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
  }
}
