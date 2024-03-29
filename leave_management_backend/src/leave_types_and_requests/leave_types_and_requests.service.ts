import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { LeaveType } from './entities/LeaveType.entity';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypesAndRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,
  ) { }

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
  ): Promise<LeaveRequest> {
    const newRequest = new LeaveRequest();

    if (!createLeaveDto.emp_id) {
      throw new BadRequestException('Employee ID (emp_id) is required');
    }
    if (!createLeaveDto.leave_type_id) {
      throw new BadRequestException('Leave Type Id is required');
    }

    // newRequest.emp_id = createLeaveDto.emp_id;

    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    return await this.leaveRequestRepository.save(newLeaveRequest);
  }

  async getLeaveRequest(leave_request_id : number): Promise<LeaveRequest>{
    const leaveRequest = await this.leaveRequestRepository.findOneBy({leave_request_id})
    if(!leaveRequest){
      throw new BadRequestException('No Leave Request Found');
    }
    return leaveRequest;
  }

  async acceptLeaveRequest(leave_request_id: number,): Promise<string> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({ leave_request_id });
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
        status: 'approved',
        emp_id: emp_id
      },
      relations: ['employee'],
    });

    const employeeRequests = approvedRequests.filter(
      (request) => request.employee.emp_id === emp_id
    );

    const totalDaysTaken = employeeRequests.reduce((total, request) => {
      const days = ((new Date(request.start_date)).getTime() - (new Date(request.end_date)).getTime()) / (1000 * 60 * 60 * 24);
      // const days = (request.end_date as Date).getTime() - request.start_date.getTime() / (1000 * 60 * 60 * 24);

      return total - days;
    }, 0);

    return leaveType.default_balance - totalDaysTaken;
  }

  //Getting employee name with specific status
  async getPendingLeaveRequests(status = "pending") {
    const pendingRequests = await this.leaveRequestRepository.find({ where: { status }, relations: ['employee'] })

    return pendingRequests.map(request => ({
      id: request.leave_request_id,
      status: request.status,
      employeeName: request?.employee?.name
    }))
  }
  
  async createLeaveType(leaveTypeDetails: CreateLeaveTypeDto): Promise<LeaveType> {
    const newLeaveType = await this.leaveTypeRepository.create(leaveTypeDetails)
    return await this.leaveTypeRepository.save(newLeaveType);
  }

  async updateLeaveType(leave_type_id: number, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: {
        leave_type_id: leave_type_id
      }
    })

    leaveType.leave_type_name = updateLeaveTypeDto.leave_type_name;
    leaveType.default_balance = updateLeaveTypeDto.default_balance;

    return await this.leaveTypeRepository.save({
      ...leaveType,
      leave_type_id
    });
  }

  async getLeaveTypes(): Promise<LeaveType[]> {
    const leaveTypes = await this.leaveTypeRepository.find();
    if(!leaveTypes){
      throw new BadRequestException("No Leave Types")
    }
    return leaveTypes;
  }
}