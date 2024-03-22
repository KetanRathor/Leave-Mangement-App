import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
// import { UpdateLeaveTypesAndRequestDto } from './dto/update-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll() {
    return `This action returns all leaveTypesAndRaxequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaveTypesAndRequest`;
  }

  // update(id: number, updateLeaveTypesAndRequestDto: UpdateLeaveTypesAndRequestDto) {
  //   return `This action updates a #${id} leaveTypesAndRequest`;
  // }

  remove(id: number) {
    return `This action removes a #${id} leaveTypesAndRequest`;
  }
}
