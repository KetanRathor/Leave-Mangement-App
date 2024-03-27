import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { LeaveType } from './entities/LeaveType.entity';

@Injectable()
export class LeaveTypesAndRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
  ): Promise<LeaveRequest> {
    if (!createLeaveDto.emp_id) {
      throw new BadRequestException('Employee ID (emp_id) is required');
    }
    if (!createLeaveDto.leave_type_id) {
      throw new BadRequestException('Leave Type Id is required');
    }
    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    return await this.leaveRequestRepository.save(newLeaveRequest);
  }



  async acceptLeaveRequest(leave_request_id: number, ): Promise<string> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({leave_request_id});
    if (!leaveRequest) {
      return 'Leave request not found.';
    }
    leaveRequest.status = 'approved';
    await this.leaveRequestRepository.save(leaveRequest);
    return 'Leave request approved.';
  }

  async rejectLeaveRequest(leave_request_id: number): Promise<string> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({ leave_request_id });
    if (!leaveRequest) {
      return 'Leave request not found.';
    }
    leaveRequest.status = 'rejected';
    await this.leaveRequestRepository.save(leaveRequest);
    return 'Leave request rejected.';
  }

  async getBalanceLeaves(emp_id: number, leave_type_id: number): Promise<number> {
    const leaveType = await this.leaveTypeRepository.findOneBy({ leave_type_id });
    if (!leaveType) {
      throw new Error('Invalid leave type');
    }
  
    const approvedRequests = await this.leaveRequestRepository.find({
      where: {
        leave_type_id: leave_type_id,
        status: 'Approved',
      },
      relations: ['employee'],
    });
  
    const employeeRequests = approvedRequests.filter(
      (request) => request.employee.e_id === emp_id
    );

    const totalDaysTaken = employeeRequests.reduce((total, request) => {
      const days = (request.end_date.getTime() - request.start_date.getTime()) / (1000 * 60 * 60 * 24);
      return total - days;
    }, 0);
  
    return leaveType.default_balance - totalDaysTaken;
  }

  // async getPendingLeaveRequests(): Promise<{ id: number, status: string, }[]> {
  //   const pendingRequests = await this.leaveRepository.find({ where: { status: 'pending' } });
  //   return pendingRequests.map(request => ({ id: request.emp_id, status: request.status }));
  // }

  // async getPendingLeaveRequests(): Promise<{ id:number, status: string, employeeName:string}[]>{
  //   const pendingRequests = await this.leaveRepository.createQueryBuilder('leaveRequest')
  //   .leftJoinAndSelect(Employee, 'employee', 'employee.emp_id=leaveRequest.emp_id')
  //   .where('leaveRequest.status=:status',{status:'pending'})
  //   .getMany()

  //   return pendingRequests.map(request=>({
  //     id:request.leave_request_id,
  //     status:request.status,
  //     employeeName:request.employee.name
  //   }))
  // }

  
}
