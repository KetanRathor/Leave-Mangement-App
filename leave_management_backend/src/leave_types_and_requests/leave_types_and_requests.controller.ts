import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { UpdateLeaveTypesAndRequestDto } from './dto/update-leave_types_and_request.dto';

@Controller('leave-types-and-requests')
export class LeaveTypesAndRequestsController {
  constructor(private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService) {}

  @Post()
  create(@Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto) {
    return this.leaveTypesAndRequestsService.create(createLeaveTypesAndRequestDto);
  }

  @Get()
  findAll() {
    return this.leaveTypesAndRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveTypesAndRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveTypesAndRequestDto: UpdateLeaveTypesAndRequestDto) {
    return this.leaveTypesAndRequestsService.update(+id, updateLeaveTypesAndRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveTypesAndRequestsService.remove(+id);
  }
}
