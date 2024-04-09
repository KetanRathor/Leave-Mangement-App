import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Put,
  Patch,
  ParseIntPipe,
  Query,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
// import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
// import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Leave Request')
@ApiBearerAuth()
@Controller('leave')
export class LeaveTypesAndRequestsController {
  constructor(
    private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'Leave request created',
    type: LeaveRequest
  })
  createRequest(
    @Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto,@Request() req
  ) 
  {
    const req_mail=req.user.email;

    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,req_mail
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiCreatedResponse({
    description: 'Get all leave requests',
    type: [LeaveRequest]
  })
  async findAll() {
    return this.leaveTypesAndRequestsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':leave_request_id')
  @ApiCreatedResponse({
    description: 'Get leave requests with id',
    type: LeaveRequest
  })
  findOne(@Param('leave_request_id') leave_request_id: number) {
    // console.log('Finding leave request with ID:', leave_request_id);
    return this.leaveTypesAndRequestsService.findOne(+leave_request_id);
  }

  @UseGuards(AuthGuard)
  @Put(':leave_request_id/status')
  @ApiCreatedResponse({
    description: 'leave status updated successfully'
  })
  async updateStatus(
    @Param('leave_request_id') leave_request_id: number,
    @Body() body: { status: string },
    @Body() CreateLeaveTypesAndRequestDto :CreateLeaveTypesAndRequestDto ,
    @Request() req,
  ): Promise<LeaveRequest> {
    const req_mail = req.user.email;
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }
    return this.leaveTypesAndRequestsService.updateStatus(
      leave_request_id,
      body.status,
      req_mail
    );
  }

  // @Get('/leaveRequest/:id')
  // getLeaveRequest(@Param('id', ParseIntPipe) id: number) {
  //   return this.leaveTypesAndRequestsService.getLeaveRequest(id);
  // }

  // @Patch(':id/accept')
  // async acceptLeaveRequest(@Param('id', ParseIntPipe) requestId: number) {
  //   return this.leaveTypesAndRequestsService.acceptLeaveRequest(requestId);
  // }

  // @Patch(':id/reject')
  // async rejectLeaveRequest(@Body('id') requestId: number) {
  //   return await this.leaveTypesAndRequestsService.rejectLeaveRequest(requestId);
  // }

  @UseGuards(AuthGuard)
  @Get('employees/pending-requests')
  @ApiCreatedResponse({
    description:'Get pending Requests'
  })
  async getEmployeesWithPendingRequests() {
    try {
      const employeesWithPendingRequests =
        await this.leaveTypesAndRequestsService.getEmployeesWithPendingLeaveRequests();
      return employeesWithPendingRequests;
    } catch (error) {
      console.error('Error getting employees with pending requests:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get(':emp_id/leave-balance/:leave_type_id')
  // async getEmployeeLeaveBalance(
  //   @Param('emp_id', ParseIntPipe) emp_id: number,
  //   @Param('leave_type_id', ParseIntPipe) leave_type_id: number,
  // ): Promise<number> {
  //   return await this.leaveTypesAndRequestsService.getBalanceLeaves(
  //     emp_id,
  //     leave_type_id,
  //   );
  // }

  // @Get(':emp_id/leave-balance')
  // async getEmployeeLeaveBalance(
  //   @Param('emp_id', ParseIntPipe) emp_id: number,
  //   @Body('leave_type_name') leave_type_name: string,
  // ): Promise<number> {
  //   return await this.leaveTypesAndRequestsService.getBalanceLeaves(
  //     emp_id,
  //     leave_type_name,
  //   );
  // }

  // @Post('/leave-type')
  // createLeaveType(@Body() createLeaveType: CreateLeaveTypeDto) {
  //   return this.leaveTypesAndRequestsService.createLeaveType(createLeaveType);
  // }

  // @Patch(':id/leaveType')
  // async updateLeaveType(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateLeaveTypeDto: UpdateLeaveTypeDto,
  // ) {
  //   return await this.leaveTypesAndRequestsService.updateLeaveType(
  //     id,
  //     updateLeaveTypeDto,
  //   );
  // }

  // @Get()
  // async getLeaveTypes() {
  //   return await this.leaveTypesAndRequestsService.getLeaveTypes();
  // }

  @UseGuards(AuthGuard)
  @Get(':emp_id/remaining-leave/:leave_type_name')
  @ApiCreatedResponse({
    description:'leave balance of employee as per leave type'
  })
  async getRemainingLeaveByType(
    @Param('emp_id') emp_id: number,
    @Param('leave_type_name') leave_type_name: string,
  ): Promise<number> {
    try {
      const remainingLeave =
        await this.leaveTypesAndRequestsService.getRemainingLeaveByType(
          emp_id,
          leave_type_name,
        );
      return remainingLeave;
    } catch (error) {
      console.error('Error getting employee remaining leave:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
