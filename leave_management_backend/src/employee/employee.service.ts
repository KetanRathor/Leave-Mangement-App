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
  ) { }


  async updateEmployee(id: number, updatedEmployeeDetails: UpdateEmployeeDto,
    req_mail
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }


    for (const key in updatedEmployeeDetails) {
      if (updatedEmployeeDetails[key] !== undefined)
        employee[key] = updatedEmployeeDetails[key]
      if (key === 'inventory_id') {
        const existingAssignment = await this.inventoryRepository.findOne({
          where: { id: updatedEmployeeDetails.inventory_id },
          relations: ['employee', 'category'],
        });

        if (existingAssignment && existingAssignment.employee) {
          throw new HttpException('Inventory already assigned to another employee', HttpStatus.BAD_REQUEST);
        } else {
          await this.inventoryService.assignInventoryToEmployee(employee.id, updatedEmployeeDetails.inventory_id);
        }
      }
    }
    employee.updated_by = req_mail;
    return await this.employeeRepository.save(employee);
  }

  //Delete employee using id
  async deleteEmployee(id: number, req_mail: string) {
    const employee = await this.employeeRepository.findOneBy({ id })
    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }
    const inventory = await this.inventoryRepository.findOne({ where: { employee: employee } });
    if (inventory) {
      inventory.employee = null;
      await this.inventoryRepository.save(inventory);
    }
    employee.deleted_by = req_mail;
    employee.deleted_at = new Date()
    await this.employeeRepository.save(employee)

    return 'Employee and associated UserCredentials deleted successfully.';

  }


  async showProfile(id: number): Promise<any> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id, deleted_at: IsNull() },
        relations: ['manager', 'department', 'inventories', 'project',],
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
        } else if (managerIDs.some(manager => manager.manager_id === employee.id)) {

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

  async findEmployees() {
    try {
      const employees = await this.employeeRepository.find({
        where: { deleted_at: IsNull() },
        relations: ['manager', 'department', 'project', 'inventories'],
      });

      const managerIds = employees.map((employee) => { if (employee.manager_id) return employee.manager_id })
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


  async uploadImage(employeeId: number, imageData: Buffer) {
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }
    employee.image = imageData;
    return await this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findById(id: number): Promise<Employee | null> {
    return await this.employeeRepository.findOneBy({ id });
  }


  async getManagerIds(): Promise<any[]> {
    return await this.employeeRepository.find({
      where: { deleted_at: IsNull() },
      select: ['manager_id'],
      relations: ['manager'],
    });

  }

}


