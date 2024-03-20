import { Injectable } from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { UpdateLeaveTypesAndRequestDto } from './dto/update-leave_types_and_request.dto';

@Injectable()
export class LeaveTypesAndRequestsService {
  create(createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto) {
    return 'This action adds a new leaveTypesAndRequest';
  }

  findAll() {
    return `This action returns all leaveTypesAndRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaveTypesAndRequest`;
  }

  update(id: number, updateLeaveTypesAndRequestDto: UpdateLeaveTypesAndRequestDto) {
    return `This action updates a #${id} leaveTypesAndRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaveTypesAndRequest`;
  }
}
