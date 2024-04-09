import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Employee } from './entities/Employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentials } from 'src/auth/entities/UserCredentials.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    // @InjectRepository(Department)
    // private readonly departmentRepository: Repository<Department>,
    @InjectRepository(UserCredentials)
    private readonly userCredentialRepository: Repository<UserCredentials>,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  //Create employee
  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    req_mail: any,
  ): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);
    newEmployee.created_by = req_mail;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(createEmployeeDto.email)) {
      throw new Error(
        'Invalid email format. Please enter a valid email address.',
      );
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(createEmployeeDto.mobile_number)) {
      throw new Error(
        'Invalid mobile number format. Please enter a valid phone number.',
      );
    }

    const userPassword = await this.authService.registerUser(
      createEmployeeDto.email,
    );

    if (createEmployeeDto.role === 'Admin') {
      newEmployee.manager_id = null;
    } else {
      newEmployee.manager_id = createEmployeeDto.manager_id;
    }

    const savedEmployee = await this.employeeRepository.save(newEmployee);

    await this.mailService.sendPasswordEmail(
      createEmployeeDto.email,
      userPassword,
    );

    return savedEmployee;
  }

  //Update employee using id
  async updateEmployee(
    id: number,
    updatedEmployeeDetails: UpdateEmployeeDto,
    req_mail,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }

    for (const key in updatedEmployeeDetails) {
      if (updatedEmployeeDetails[key] !== undefined) {
        employee[key] = updatedEmployeeDetails[key];
      }
    }
    employee.updated_by = req_mail;

    return await this.employeeRepository.save(employee);
  }

  //Delete employee using id
  async deleteEmployee(id: number, req_mail: string) {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }
    //  await this.employeeRepository.remove(employee);
    employee.deleted_by = req_mail;
    employee.deleted_at = new Date();

    const userCredentials = await this.userCredentialRepository.findOne({
      where: { email: employee.email },
    });

    if (userCredentials) {
      // Remove the user credentials
      await this.userCredentialRepository.remove(userCredentials);
    }

    employee.deleted_by = req_mail;
    employee.deleted_at = new Date();
    await this.employeeRepository.save(employee);

    return 'Employee and associated UserCredentials deleted successfully.';
  }

  //Show Employe Profile
  async showProfile(id: number) {
    return this.employeeRepository.findOneBy({ id });
  }

  //Show Employee List
  async findEmployees() {
    // try
    // {
    //     return await this.employeeRepository.find()
    // }
    // catch(error){
    //     throw new HttpException('Unable to find employee.',HttpStatus.BAD_REQUEST)
    // }
    return await this.employeeRepository.find({
      where: { deleted_at: IsNull() },
    });
  }
}
