import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveTypesAndRequestDto } from './dto/create-leave_types_and_request.dto';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { Between, In, LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { start } from 'repl';
import { Console } from 'console';
import { MailService } from 'src/mail/mail.service';
import { Employee } from 'src/employee/entities/Employee.entity';


@Injectable()
export class LeaveTypesAndRequestsService {


  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    private readonly mailService: MailService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  async createRequest(
    createLeaveDto: CreateLeaveTypesAndRequestDto,
    req_mail: string,
    emp_id: number

  ): Promise<LeaveRequest> {

    const newLeaveRequest = this.leaveRequestRepository.create(createLeaveDto);
    newLeaveRequest.created_by = req_mail;

    newLeaveRequest.emp_id = emp_id
    const savedLeaveRequest = await this.leaveRequestRepository.save(newLeaveRequest);
    const employee = await this.employeeRepository.findOne({ where: { email: req_mail } });
    const employeeName = employee ? employee.name : "Unknown";
    const fromDateAndStartDate = `${createLeaveDto.start_date} to ${createLeaveDto.end_date}`

    try {

      const employee = await this.employeeRepository.findOne({
        where: { id: emp_id },
        relations: ['manager'],
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const managerEmail = employee.manager?.email;
      console.log("managerEmail:", managerEmail)

      if (!managerEmail) {
        console.warn('Manager email not found for employee:', employee.id);
      } else {
        console.log("req_mail", req_mail, "managerEmail", managerEmail)
        await this.mailService.sendLeaveRequestEmail(req_mail, managerEmail, createLeaveDto.reason, employeeName, fromDateAndStartDate);
      }
      return savedLeaveRequest;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw new InternalServerErrorException('Error creating leave request');
    }
  }


  findOne(id: number): Promise<LeaveRequest> {
    console.log(id);
    return this.leaveRequestRepository.findOneBy({ id });
  }


  async findAllByEmployeeId(emp_id: number): Promise<LeaveRequest[]> {
    return await this.leaveRequestRepository.find({
      where: { emp_id },
      // relations: ['employee'],
    });
  }


  findAll() {
    return this.leaveRequestRepository.find({
      // relations: ['employee'] 
    });
  }


  async updateStatus(
    leave_request_id: number,
    status: string,
    req_mail: string,
  ): Promise<{ leaveRequest: LeaveRequest, message: string }> {
    const leaveRequest = await this.findOne(leave_request_id);
    leaveRequest.status = status;
    leaveRequest.updated_by = req_mail;
    const employee = await this.employeeRepository.findOne({ where: { email: req_mail } });
    const employeeName = employee ? employee.name : "Unknown";

    const employeeEmail = leaveRequest.created_by;
    const updatedLeaveRequest = await this.leaveRequestRepository.save(leaveRequest);
    const message = `Your leave request has been ${status} by ${employeeName}.`;
    if (updatedLeaveRequest) {
      await this.mailService.sendLeaveStatusEmail(employeeEmail, message);
    }

    return { leaveRequest: updatedLeaveRequest, message };
  }


  async getLeaveRequest(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({ id });
    if (!leaveRequest) {
      throw new BadRequestException('No Leave Request Found');
    }
    return leaveRequest;
  }

  async getEmployeesWithPendingLeaveRequests(): Promise<{
    employeeName: string;
    start_date: Date;
    end_date: Date;
    leave_type: string;
    reason: string;
  }[]> {
    try {
      const pendingRequests = await this.leaveRequestRepository.find({
        where: {
          status: 'pending',
        },
        relations: ['employee'],
      });

      return pendingRequests.map((request) => ({
        id:request.id,
        employeeName: request.employee.name,
        start_date: request.start_date,
        end_date: request.end_date,
        leave_type: request.leave_type,
        reason: request.reason,
        manager_id:request.employee.manager_id,
      }));
    } catch (error) {
      console.error('Error fetching employees with pending requests:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getRemainingLeaveBalance(id: number): Promise<any> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear =
        currentMonth >= 3
          ? currentDate.getFullYear()
          : currentDate.getFullYear() - 1;
      const leaveRequests = await this.leaveRequestRepository.find({
        where: {
          emp_id: id,

        },
      });

      let default_balance = 21;
      let remainingBalance = default_balance;

      leaveRequests.forEach((request) => {
        const startDate = new Date(request.start_date);
        const endDate = request.end_date ? new Date(request.end_date) : null;

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();

        if (startYear === currentYear && startMonth >= 3) {
          let daysDifference: number;
          if (endDate) {
            const millisecondsPerDay = 1000 * 60 * 60 * 24;
            const differenceInMilliseconds =
              endDate.getTime() - startDate.getTime();
            daysDifference =
              Math.ceil(differenceInMilliseconds / millisecondsPerDay) + 1;
          } else {
            daysDifference = 1;
          }

          if (request.status === 'approved' || request.status === 'pending') {
            switch (request.leave_type) {
              case 'full':
                remainingBalance -= daysDifference;
                break;
              case 'first half':
              case 'second half':
                remainingBalance -= daysDifference / 2;
                break;
              default:
                break;
            }
          }
        }
      });

      remainingBalance = Math.max(remainingBalance, 0);

      return {
        remainingBalance: remainingBalance,
        default_balance: default_balance,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to calculate remaining leave balance',
      );
    }
  }


  async getRemainingLeaveBalanceforworkfromhome(id: number): Promise<any> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const approvedRequests = await this.leaveRequestRepository.find({
        where: {
          emp_id: id,
          leave_type: 'work from home',
          status: In(['approved', 'pending']),
        },
      });

      const defaultBalancePerMonth: number[] = new Array(12).fill(3);

      approvedRequests.forEach((request) => {
        const startDate = new Date(request.start_date);
        const endDate = request.end_date ? new Date(request.end_date) : null;



        const startMonth = startDate.getMonth();
        const startYear = startDate.getFullYear();
        const endMonth = endDate ? endDate.getMonth() : null;
        const endYear = endDate ? endDate.getFullYear() : null;

        let startDay = startDate.getDate();
        let endDay = endDate ? endDate.getDate() : null;



        if (startYear === currentYear) {
          if (startMonth === currentMonth) {
            if (endMonth === currentMonth) {
              defaultBalancePerMonth[currentMonth] -= endDay - startDay + 1;
            } else {

              const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
              defaultBalancePerMonth[currentMonth] -= daysInStartMonth - startDay + 1;
            }
          } else if (endMonth === currentMonth) {
            defaultBalancePerMonth[currentMonth] -= endDay;
          }
        }
      });

      // Calculate remaining balance for the current month
      const remainingWorkFromHomeBalance = Math.max(

        defaultBalancePerMonth[currentMonth],
        0,
      );

      return {
        remainingBalance: remainingWorkFromHomeBalance,
        defaultBalance: 3,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to calculate remaining work from home balance',
      );
    }
  }


  async findAllRequestsByEmployeeId(emp_id: number): Promise<Employee[]> {

    if (emp_id)
      return await this.employeeRepository.find({
        where: [
          { manager_id: emp_id },
        ],
      });
  }

  async findPendingRequestsByEmployeeId(employeeId: number): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: { emp_id: employeeId, status: 'pending' },
      relations: ['employee'],
    });
  }


  async getEmployeesOnLeaveToday(
    managerId: number,
    role: string,
  ): Promise<Employee[]> {
    try {
      const today = new Date();
      const leaveRequests = await this.leaveRequestRepository.find({
        where: { status: 'approved' },
        relations: ['employee'],
      });

      const filteredLeaveRequests = leaveRequests.filter((leaveRequest) => {
        const startDate = new Date(leaveRequest.start_date);
        const endDate = leaveRequest.end_date
          ? new Date(leaveRequest.end_date)
          : null;

        // Get the start and end timestamps for today
        const todayStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );
        const todayEnd = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999,
        );

        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const todayDateString = today.toISOString().slice(0, 10); // Extract YYYY-MM-DD part

        const isOnLeaveToday =
          (endDate === null && startDate.toISOString().slice(0, 10) === todayDateString) || // Leave for one day
          (endDate !== null &&
            startDate.toISOString().slice(0, 10) <= todayDateString &&
            endDate.toISOString().slice(0, 10) >= todayDateString); // Leave spans across multiple days





        if (role === 'Admin') {

          return isOnLeaveToday;
        } else {

          return (
            isOnLeaveToday && leaveRequest.employee.manager_id === managerId
          );
        }
      });

      const employeesOnLeaveToday: any[] = filteredLeaveRequests.map(
        (leaveRequest) => {
          return {
            // employee: leaveRequest.employee,
            leaveRequest,
          };
        },
      );
      console.log("employeesOnLeaveToday", employeesOnLeaveToday)
      return employeesOnLeaveToday;
    } catch (error) {
      console.error('Error fetching employees on leave today:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}






