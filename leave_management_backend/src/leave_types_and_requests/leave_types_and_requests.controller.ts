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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateLeaveStatus } from './dto/update-leave_status.dto';
import { Res } from '@nestjs/common';

@ApiTags('Leave Request')
@ApiBearerAuth('JWT-auth')
@Controller('leave')
export class LeaveTypesAndRequestsController {
  leaveService: any;
  constructor(
    private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'Leave request created',
    type: LeaveRequest,
  })
  createRequest(
    @Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto,
    @Request() req,
  ) {
    const req_mail = req.user.email;

    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,
      req_mail,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all leave requests',
    type: [LeaveRequest],
  })
  async findAll() {
    return this.leaveTypesAndRequestsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':leave_request_id')
  @ApiOkResponse({
    description: 'Get leave requests of employee with given id',
    type: LeaveRequest,
  })
  findOne(@Param('leave_request_id', ParseIntPipe) leave_request_id: number) {
    return this.leaveTypesAndRequestsService.findOne(leave_request_id);
  }

  @UseGuards(AuthGuard)
  @Put(':leave_request_id/status')
  @ApiCreatedResponse({
    description: 'leave request status will be updated as response',
  })
  @ApiBody({
    type: UpdateLeaveStatus,
  })
  async updateStatus(
    @Param('leave_request_id') leave_request_id: number,
    @Body() body: { status: string },
    @Request() req,
  ): Promise<LeaveRequest> {
    const req_mail = req.user.email;
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }
    return this.leaveTypesAndRequestsService.updateStatus(
      leave_request_id,
      body.status,
      req_mail,
    );
  }

  @UseGuards(AuthGuard)
  @Get('employees/pending-requests')
  @ApiOkResponse({
    description: 'Get employee list whose leave request status is pending',
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

  @Get('remaining-balance/:empId')
  @ApiParam({ name: 'empId', description: 'Employee ID' })
  async getRemainingLeaveBalance(@Param('empId') id: number): Promise<number> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid employee ID');
    }
    return this.leaveTypesAndRequestsService.getRemainingLeaveBalance(id);
  }

  @Get('remaining-balance/work-from-home/:empId')
  @ApiParam({ name: 'empId', description: 'Employee ID' })
  async getRemainingLeaveBalanceforworkfromhome(
    @Param('empId') id: number,
  ): Promise<number> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid employee ID');
    }
    return this.leaveTypesAndRequestsService.getRemainingLeaveBalanceforworkfromhome(
      id,
    );
  }

  // @UseGuards(AuthGuard)
  // @Get(':emp_id/remaining-leave/:leave_type_name')
  // @ApiOkResponse({
  //   description:'Get leave balance of employee as per leave type'
  // })
  // async getRemainingLeaveByType(
  //   @Param('emp_id') emp_id: number,
  //   @Param('leave_type_name') leave_type_name: string,
  // ): Promise<number> {
  //   try {
  //     const remainingLeave =
  //       await this.leaveTypesAndRequestsService.getRemainingLeaveByType(
  //         emp_id,
  //         leave_type_name,
  //       );
  //     return remainingLeave;
  //   } catch (error) {
  //     console.error('Error getting employee remaining leave:', error);
  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
