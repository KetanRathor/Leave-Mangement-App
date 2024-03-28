import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Put, Patch, ParseIntPipe } from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { UpdateLeaveTypesAndRequestDto } from './dto/update-leave_types_and_request.dto';

@Controller('leave')
export class LeaveTypesAndRequestsController {
  constructor(private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService) {}

  @Post()
  createRequest(@Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto) {
    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,
    );
  }

  @Patch(':id/accept')
   async acceptLeaveRequest(@Param('id', ParseIntPipe) requestId: number) {
        return this.leaveTypesAndRequestsService.acceptLeaveRequest(requestId);
    }

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
    async getPendingLeaveRequests(): Promise<{ id: number, status: string, employeeName : string }[]> {
        return await this.leaveTypesAndRequestsService.getPendingLeaveRequests();
    }



}
