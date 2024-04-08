import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
// import { LeaveType } from './entities/LeaveType.entity';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypesAndRequestsService {

  private readonly leaveTypes = [
    { leave_type_id: 1, leave_type_name: 'Full day', default_balance: 21 },
    { leave_type_id: 2, leave_type_name: 'Half day', default_balance: 10 },
    { leave_type_id: 3, leave_type_name: 'work from home', default_balance: 10 },
  ];
  // updateStatus(leave_request_id: number, status: string): any {
  //   throw new Error('Method not implemented.');
  // }
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    // @InjectRepository(LeaveType)
    // private readonly leaveTypeRepository: Repository<LeaveType>,
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
  findOne(id: number): Promise<LeaveRequest> {
    console.log(id);
    return this.leaveRequestRepository.findOneBy({ id });
  }

  findAll() {
    return this.leaveRequestRepository.find();
  }

  async updateStatus(
    leave_request_id: number,
    status: string,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(leave_request_id);
    leaveRequest.status = status;
    return this.leaveRequestRepository.save(leaveRequest);
  }
  async getLeaveRequest(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({id})
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
  async getBalanceLeaves(emp_id: number, leave_type_id: number): Promise<number> {
  const leaveType = this.leaveTypes.find(type => type.leave_type_id === leave_type_id);
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
    (request) => request.employee.id === emp_id
  );

  const totalDaysTaken = employeeRequests.reduce((total, request) => {
    const days = ((new Date(request.start_date)).getTime() - (new Date(request.end_date)).getTime()) / (1000 * 60 * 60 * 24);
    // const days = (request.end_date as Date).getTime() - request.start_date.getTime() / (1000 * 60 * 60 * 24);

    return total - days;
  }, 0);

  return leaveType.default_balance - totalDaysTaken;
}


  async getPendingLeaveRequests(status="pending"){

    const pendingRequests =  await this.leaveRequestRepository.find({where: {status}, relations: ['employee']})

    return pendingRequests.map(request => ({
      id: request.id,
      status: request.status,
      employeeName: request?.employee?.name
    }))
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
}