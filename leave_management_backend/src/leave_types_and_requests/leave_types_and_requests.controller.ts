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
import { Employee } from 'src/employee/entities/Employee.entity';

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
    description: 'Leave request will be created as response',
    type: LeaveRequest,
  })
  createRequest(
    @Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto,
    @Request() req,
  ) {
    const req_mail = req.user.email;
    const emp_id = req.user.id;

    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,
      req_mail,
      emp_id,
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

  // @UseGuards(AuthGuard)
  // @Get(':leave_request_id')
  // @ApiOkResponse({
  //   description: 'Get leave requests of employee with given id',
  //   type: LeaveRequest
  // })
  // findOne(@Param('leave_request_id',ParseIntPipe) leave_request_id: number) {
  //   return this.leaveTypesAndRequestsService.findOne(leave_request_id);
  // }

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
  ): Promise<{ leaveRequest: LeaveRequest; message: string }> {
    const req_mail = req.user.email;
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }
    const { leaveRequest, message } =
      await this.leaveTypesAndRequestsService.updateStatus(
        leave_request_id,
        body.status,
        req_mail,
      );
    return { leaveRequest, message };
  }

  @UseGuards(AuthGuard)
  @Get('employees/pending-requests')
  @ApiOkResponse({
    description:'Get employee list whose leave request status is pending'
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

  @UseGuards(AuthGuard)
  @Get('remaining-balance/:empId')
  @ApiOkResponse({
    description: 'Get remaining annual leave balance ',
  })
  async getRemainingLeaveBalance(@Param('empId') id: number): Promise<number> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid employee ID');
    }
    return this.leaveTypesAndRequestsService.getRemainingLeaveBalance(id);
  }

  @UseGuards(AuthGuard)
  @Get('remaining-balance/work-from-home/:empId')
  // @ApiParam({ name: 'empId', description: 'Employee ID' })
  @ApiOkResponse({
    description: 'Get remaing days of work from home ',
  })
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

  @UseGuards(AuthGuard)
  @Get(':employeeId/requests')
  @ApiOkResponse({
    description: 'Get all leave requests of given employee id',
  })
  async findAllByEmployeeId(
    @Param('employeeId') employeeId: number,
  ): Promise<LeaveRequest[]> {
    return await this.leaveTypesAndRequestsService.findAllByEmployeeId(
      employeeId,
    );
  }

  //   @Get('leave/employees_on_leave_today')
  // async getEmployeesOnLeaveToday() {
  //   const numEmployeesOnLeave = await this.leaveTypesAndRequestsService.getNumberOfEmployeesOnLeaveToday();
  //   return { numEmployeesOnLeave };
  // }

//   @Get('/employees/employees-leave-on-today')

// async getEmployeesOnLeaveToday(): Promise<Employee[]> { 
  
  
//   try {
//     console.log(".............................");
    
//     const employeesOnLeave = await this.leaveTypesAndRequestsService.getEmployeesOnLeaveToday();
//     return employeesOnLeave;
//   } catch (error) {
//     console.error('Error fetching employees on leave today:', error);
//     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
//   }
// }


  @UseGuards(AuthGuard)
  @Get(':employeeId/pending-requests')
  @ApiOkResponse({
    description:
      'Get list of pending leave requests of employees who have manager with given id',
    type: LeaveRequest,
  })
  async findAllRequestsByEmployeeId(
    @Param('employeeId') employeeId: number,
  ): Promise<{ pendingRequests: LeaveRequest[] }> {
    try {
      const pendingRequests: LeaveRequest[] = [];

      const ab =
        await this.leaveTypesAndRequestsService.findAllRequestsByEmployeeId(
          employeeId,
        );

      for (const employee of ab) {
        const employeeRequests =
          await this.leaveTypesAndRequestsService.findPendingRequestsByEmployeeId(
            employee.id,
          );
        pendingRequests.push(...employeeRequests);
      }
      return { pendingRequests };
    } catch (error) {
      console.error('Error occurred while fetching pending requests:', error);
    }
  }


@UseGuards(AuthGuard)
@Get('/employees-leave-on-today')
@ApiOkResponse({
  description: 'Get employees on leave today ',
})
async getEmployeesOnLeaveToday(
  @Request() req,
): Promise<Employee[]> {
  const loggedInEmployeeId = req.user.id; // Assuming you're storing the logged-in user's ID in req.user.id
  const role=req.user.role;
  // console.log(role)
  try {
    const employeesOnLeave = await this.leaveTypesAndRequestsService.getEmployeesOnLeaveToday(loggedInEmployeeId,role);
    return employeesOnLeave;
  } catch (error) {
    console.error('Error fetching employees on leave today:', error);
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

}
