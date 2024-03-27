import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';

@Injectable()
export class LeaveTypesAndRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRepository: Repository<LeaveRequest>,
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
    const newLeaveRequest = this.leaveRepository.create(createLeaveDto);
    return await this.leaveRepository.save(newLeaveRequest);
  }



  async acceptLeaveRequest(leave_request_id: number, ): Promise<string> {
    const leaveRequest = await this.leaveRepository.findOneBy({leave_request_id});
    if (!leaveRequest) {
      return 'Leave request not found.';
    }
    leaveRequest.status = 'approved';
    await this.leaveRepository.save(leaveRequest);
    return 'Leave request approved.';
  }

  async rejectLeaveRequest(leave_request_id: number): Promise<string> {
    const leaveRequest = await this.leaveRepository.findOneBy({ leave_request_id });
    if (!leaveRequest) {
      return 'Leave request not found.';
    }
    leaveRequest.status = 'rejected';
    await this.leaveRepository.save(leaveRequest);
    return 'Leave request rejected.';
  }

  // async getPendingLeaveRequests(): Promise<{ id: number, status: string, }[]> {
  //   const pendingRequests = await this.leaveRepository.find({ where: { status: 'pending' } });
  //   return pendingRequests.map(request => ({ id: request.emp_id, status: request.status }));
  // }

  async getPendingLeaveRequests(): Promise<{ id:number, status: string, employeeName:string}[]>{
    const pendingRequests = await this.leaveRepository.createQueryBuilder('leaveRequest')
    .leftJoinAndSelect(Employee, 'employee', 'employee.emp_id=leaveRequest.emp_id')
    .where('leaveRequest.status=:status',{status:'pending'})
    .getMany()

    return pendingRequests.map(request=>({
      id:request.leave_request_id,
      status:request.status,
      employeeName:request.employee.name
    }))
  }

  
}
