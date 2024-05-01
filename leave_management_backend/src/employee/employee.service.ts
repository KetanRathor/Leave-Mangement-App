import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
// import { IsNull, Repository } from 'typeorm';
import { Employee } from './entities/Employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentials } from 'src/auth/entities/UserCredentials.entity';
import { MailService } from 'src/mail/mail.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(UserCredentials)
    private readonly userCredentialRepository: Repository<UserCredentials>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly inventoryService: InventoryService,

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

    // const inventory = await this.inventoryRepository

        const savedEmployee = await this.employeeRepository.save(newEmployee);
        const isInventry = createEmployeeDto?.inventory_id;
        if(isInventry){
          await this.inventoryService.assignInventoryToEmployee(savedEmployee.id,isInventry)
        }
        
        const employeeId = savedEmployee.id
        const userPassword = await this.authService.registerUser(createEmployeeDto.email)
        // const userPassword = await this.authService.registerUser(employeeId)

        await this.mailService.sendPasswordEmail(createEmployeeDto.email, userPassword);

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

    const oldEmail = employee.email;
    console.log('oldEmail', oldEmail);
    for (const key in updatedEmployeeDetails) {
      if (updatedEmployeeDetails[key] !== undefined)
        employee[key] = updatedEmployeeDetails[key];
      if (key === 'inventory_id') {
        const existingAssignment = await this.inventoryRepository.findOne({
          where: { id: updatedEmployeeDetails.inventory_id },
          relations: ['employee', 'category'],
        });

        if (existingAssignment && existingAssignment.employee) {
          throw new HttpException(
            'Inventory already assigned to another employee',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          await this.inventoryService.assignInventoryToEmployee(
            employee.id,
            updatedEmployeeDetails.inventory_id,
          );
        }
      }
    }
    employee.updated_by = req_mail;

    const userCredential = await this.userCredentialRepository.findOneBy({
      email: oldEmail,
    });
    if (userCredential) {
      userCredential.email = updatedEmployeeDetails.email;
      await this.userCredentialRepository.save(userCredential);
    }

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
          userCredentials.deleted_by = req_mail;
          userCredentials.deleted_at = new Date();
          await this.userCredentialRepository.save(userCredentials);
            // await this.userCredentialRepository.remove(userCredentials);
        }

    employee.deleted_by = req_mail;
    employee.deleted_at = new Date();
    await this.employeeRepository.save(employee);

    return 'Employee and associated UserCredentials deleted successfully.';
  }

  //Show Employe Profile
  // async showProfile(id: number) {
  //     return this.employeeRepository.findOne({ where : { id ,deleted_at: IsNull()},
  //          relations: ['manager','department','inventories','project'] });

  // }
  async showProfile(id: number): Promise<any> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id, deleted_at: IsNull() },
        relations: ['manager', 'department', 'inventories', 'project'],
      });
      const managerIDs = await this.employeeRepository.find({
        where: { deleted_at: IsNull() },
        select: ['manager_id'],
        // relations: ['manager'],
      });
      if (employee) {
        let role;
        if (employee.admin) {
          role = 'Admin';
        } else if (
          managerIDs.some((manager) => manager.manager_id === employee.id)
        ) {
          role = 'Manager';
        } else {
          role = 'Employee';
        }

        return { ...employee, role };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //Show Employee List
  // async findEmployees() {

  //     return await this.employeeRepository.find({ where: { deleted_at: IsNull() },relations:['manager','department','project','inventories'] })
  // }

  async findEmployees() {
    try {
      const employees = await this.employeeRepository.find({
        where: { deleted_at: IsNull() },
        relations: ['manager', 'department', 'project', 'inventories'],
      });

      const managerIds = employees.map((employee) => {
        if (employee.manager_id) return employee.manager_id;
      });
      const employeesWithRoles = employees.map((employee) => {
        let role;

        if (employee.admin) {
          role = 'Admin';
        } else if (managerIds.includes(employee.id)) {
          role = 'Manager';
        } else {
          role = 'Employee';
        }

        return { ...employee, role };
      });

      return employeesWithRoles;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async findManagerList(){
  //     return await this.employeeRepository.find({where:{role:'Manager'},relations:['manager','department']})
  // }

  async uploadImage(employeeId: number, imageData: Buffer) {
    const employee = await this.employeeRepository.findOneBy({
      id: employeeId,
    });
    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }
    employee.image = imageData;
    return await this.employeeRepository.save(employee);
  }

  // async findManagers() {

  //   const managerEmployees = await this.employeeRepository.find({
  //     where: [
  //       { manager_id: IsNull(), deleted_at: IsNull() },
  //       { admin: true, deleted_at: IsNull() },
  //     ],
  //   });

  //   return managerEmployees;
  // }
  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findById(id: number): Promise<Employee | null> {
    return await this.employeeRepository.findOneBy({ id });
  }

  // async getManagerIds(): Promise<any[]> {
  //   return await this.employeeRepository.find({
  //       where: { deleted_at:IsNull() },
  //       select: ['manager_id'],
  //       relations: ['manager'],

  //   });

  // }
}
