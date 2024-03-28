import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Put, Patch, ParseIntPipe, Query } from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { UpdateLeaveTypesAndRequestDto } from './dto/update-leave_types_and_request.dto';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';

@Controller('leave')
export class LeaveTypesAndRequestsController {
  constructor(private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService) {}

  @Post()
  createRequest(@Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto) {
    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,
    );
  }

  @Post("/leave-type")
  createLeaveType(@Body() createLeaveType : CreateLeaveTypeDto){
    return this.leaveTypesAndRequestsService.createLeaveType(createLeaveType);
  }


  @Patch(':id/accept')
   async acceptLeaveRequest(@Param('id', ParseIntPipe) requestId: number) {
        return this.leaveTypesAndRequestsService.acceptLeaveRequest(requestId);
    }

  //   @Get(':emp_id/leave-balance/:leave_type_id')
  // async getEmployeeLeaveBalance(
  //   @Param('emp_id') emp_id: number,
  //   @Param('leave_type_id') leave_type_id: number,
  // ): Promise<number> {
  //   return await this.leaveTypesAndRequestsService.getBalanceLeaves(emp_id, leave_type_id);
  // }

//   @Post('accept')
// async acceptLeaveRequest(@Body('id') requestId: number) {
//   try {
//     const result = await this.leaveTypesAndRequestsService.acceptLeaveRequest(requestId);
//     return { message: result };
//   } catch (error) {
//     throw new HttpException(error.message, HttpStatus.NOT_FOUND);
//   }
// }



    @Patch(':id/reject')
    async rejectLeaveRequest(@Body('id') requestId: number) {
        return await this.leaveTypesAndRequestsService.rejectLeaveRequest(requestId);
    }

    @Get()
    async getPendingLeaveRequests(
      // @Query('status') 
    status: string)
    // : Promise<{ id: number, status: string, employeeName : string }[]>
     {
      console.log(status)
        return await this.leaveTypesAndRequestsService.getPendingLeaveRequests(status);
    }



} 
