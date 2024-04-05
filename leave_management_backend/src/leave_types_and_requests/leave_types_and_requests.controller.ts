import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Put, Patch, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { UpdateLeaveTypesAndRequestDto } from './dto/update-leave_types_and_request.dto';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
// import { ApiTags } from '@nestjs/swagger';
// @ApiTags('leave')
@Controller('leave')
export class LeaveTypesAndRequestsController {
  constructor(private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService) { }

  @Post()
  createRequest(@Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto) {
    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,
    );
  }
  @Get()
  async findAll() {
    return this.leaveTypesAndRequestsService.findAll();
  }

  @Get(':leave_request_id')
  findOne(@Param('leave_request_id') leave_request_id: number) {
    // console.log('Finding leave request with ID:', leave_request_id);
    return this.leaveTypesAndRequestsService.findOne(+leave_request_id);
}

@Put(':leave_request_id/status')
async updateStatus(@Param('leave_request_id') leave_request_id: number, @Body() body: { status: string }): Promise<LeaveRequest> {
  if (!body.status) {
    throw new BadRequestException('Status is required');
  }
    return this.leaveTypesAndRequestsService.updateStatus(
      leave_request_id,
      body.status,
    );
}

  @Get('/leaveRequest/:id')
  getLeaveRequest(@Param('id', ParseIntPipe) id : number){
    return this.leaveTypesAndRequestsService.getLeaveRequest(id);
  }

  // @Patch(':id/accept')
  // async acceptLeaveRequest(@Param('id', ParseIntPipe) requestId: number) {
  //   return this.leaveTypesAndRequestsService.acceptLeaveRequest(requestId);
  // }

  // @Patch(':id/reject')
  // async rejectLeaveRequest(@Body('id') requestId: number) {
  //   return await this.leaveTypesAndRequestsService.rejectLeaveRequest(requestId);
  // }

  @Get('/pending')
  async getPendingLeaveRequests(status: string)
  // : Promise<{ id: number, status: string, employeeName : string }[]> 
  {
    return await this.leaveTypesAndRequestsService.getPendingLeaveRequests(status);
  }

  // @Get(':emp_id/leave-balance/:leave_type_id')
  // async getEmployeeLeaveBalance(
  //   @Param('emp_id', ParseIntPipe) emp_id: number,
  //   @Param('leave_type_id', ParseIntPipe) leave_type_id: number,
  // ): Promise<number> {
  //   return await this.leaveTypesAndRequestsService.getBalanceLeaves(emp_id, leave_type_id);
  // }

  // @Get(':emp_id/leave-balance')
  // async getEmployeeLeaveBalance(
  //   @Param('emp_id', ParseIntPipe) emp_id: number,
  //   @Body('leave_type_name') leave_type_name: string,
  // ): Promise<number> {
  //   return await this.leaveTypesAndRequestsService.getBalanceLeaves(emp_id, leave_type_name);
  // }



  // @Post("/leave-type")
  // createLeaveType(@Body() createLeaveType: CreateLeaveTypeDto) {
  //   return this.leaveTypesAndRequestsService.createLeaveType(createLeaveType);
  // }

  // @Patch(':id/leaveType')
  // async updateLeaveType(@Param('id', ParseIntPipe) id: number, @Body() updateLeaveTypeDto:UpdateLeaveTypeDto) {
  //   return await this.leaveTypesAndRequestsService.updateLeaveType(id, updateLeaveTypeDto);
  // }

  // @Get()
  // async getLeaveTypes(){
  //   return await this.leaveTypesAndRequestsService.getLeaveTypes();
  // }

}