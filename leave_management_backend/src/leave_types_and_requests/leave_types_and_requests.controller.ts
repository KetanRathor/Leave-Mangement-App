import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { UpdateLeaveTypesAndRequestDto } from './dto/update-leave_types_and_request.dto';

@Controller('leave-types-and-requests')
export class LeaveTypesAndRequestsController {
  constructor(private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService) {}

  @Post()
  createRequest(@Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto) {
    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,
    );
  }

}
