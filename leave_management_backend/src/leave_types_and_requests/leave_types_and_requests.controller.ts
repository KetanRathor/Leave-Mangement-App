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
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateLeaveStatus } from './dto/update-leave_status.dto';
import { Res } from '@nestjs/common';
import { Employee } from 'src/employee/entities/Employee.entity';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';


@ApiTags('Leave Request')
@ApiBearerAuth("JWT-auth")
@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveTypesAndRequestsController {
  leaveService: any;
  constructor(
    private readonly leaveTypesAndRequestsService: LeaveTypesAndRequestsService,
  ) {}

    
  @Post()
  @ApiCreatedResponse({
    description: 'Leave request created',
    type: LeaveRequest
  })
  createRequest(
    @Body() createLeaveTypesAndRequestDto: CreateLeaveTypesAndRequestDto,
    @Request() req
  ) 
  {
    const req_mail=req.user.user.email;
    const emp_id = req.user.user.id

    return this.leaveTypesAndRequestsService.createRequest(
      createLeaveTypesAndRequestDto,req_mail,emp_id
    );
  }

    
  @Get()
  @ApiOkResponse({
    description: 'Get all leave requests',
    type: [LeaveRequest]
  })
  async findAll() {
    return this.leaveTypesAndRequestsService.findAll();
  }

    
  @Get(':leave_request_id')
  @ApiOkResponse({
    description: 'Get leave requests of employee with given id',
    type: LeaveRequest
  })
  findOne(@Param('leave_request_id',ParseIntPipe) leave_request_id: number) {
    return this.leaveTypesAndRequestsService.findOne(leave_request_id);
  }

    
  @Put(':leave_request_id/status')
  @ApiCreatedResponse({
    description: 'leave request status will be updated as response'
  })
  @ApiBody({
    type:UpdateLeaveStatus
  })
  // async updateStatus(
  //   @Param('leave_request_id') leave_request_id: number,
  //   @Body() body: { status: string },
  //   @Request() req,
  // ): Promise<LeaveRequest> {
  //   const req_mail = req.user.email;
  //   if (!body.status) {
  //     throw new BadRequestException('Status is required');
  //   }   
  //   return this.leaveTypesAndRequestsService.updateStatus(
  //     leave_request_id,
  //     body.status,
  //     req_mail
  //   );
  // }
  async updateStatus(
    @Param('leave_request_id') leave_request_id: number,
    @Body() body: { status: string },
    @Request() req,
  ): Promise<{ leaveRequest: LeaveRequest, message: string }> {
    const req_mail = req.user.user.email;
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }   
    const { leaveRequest, message } = await this.leaveTypesAndRequestsService.updateStatus(
      leave_request_id,
      body.status,
      req_mail
    );
    return { leaveRequest, message };
  }

    
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
  async getRemainingLeaveBalanceforworkfromhome(@Param('empId') id: number): Promise<number> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid employee ID');
    }
    return this.leaveTypesAndRequestsService.getRemainingLeaveBalanceforworkfromhome(id);
  }
  

  @Get(':employeeId/requests')
  async findAllByEmployeeId(@Param('employeeId') employeeId: number): Promise<LeaveRequest[]> {
    return await this.leaveTypesAndRequestsService.findAllByEmployeeId(employeeId);
  }

//   @Get('leave/employees_on_leave_today')
// async getEmployeesOnLeaveToday() {
//   const numEmployeesOnLeave = await this.leaveTypesAndRequestsService.getNumberOfEmployeesOnLeaveToday();
//   return { numEmployeesOnLeave };
// }
  
@Get('/employees/employees-leave-on-today')

async getEmployeesOnLeaveToday(): Promise<Employee[]> { 
  try {
    console.log(".............................");
    
    const employeesOnLeave = await this.leaveTypesAndRequestsService.getEmployeesOnLeaveToday();
    return employeesOnLeave;
  } catch (error) {
    console.error('Error fetching employees on leave today:', error);
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  
@Get(':employeeId/pending-requests')
@ApiOkResponse({
  description:'Get list of pending leave requests of employees who have manager with given id',
  type:LeaveRequest
})
  async findAllRequestsByEmployeeId(@Param('employeeId') employeeId: number): Promise<{ pendingRequests: LeaveRequest[] }> {
    try{
    const pendingRequests: LeaveRequest[] = [];

    const ab=await this.leaveTypesAndRequestsService.findAllRequestsByEmployeeId(employeeId);

    for (const employee of ab) {
      const employeeRequests = await this.leaveTypesAndRequestsService.findPendingRequestsByEmployeeId(employee.id);
      pendingRequests.push(...employeeRequests);
    }
    return { pendingRequests };
    }catch(error){
      console.error('Error occurred while fetching pending requests:', error);
    }
  }
}
