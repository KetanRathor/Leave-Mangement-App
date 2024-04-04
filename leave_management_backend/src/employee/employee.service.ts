import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/Employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { Department } from './entities/Department.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';


@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department> 
  ) {}
  // Create Department
  async createDepartment(departmentName: CreateDepartmentDto) {
    return await this.departmentRepository.save(departmentName);
  }

  //Create employee
  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    req: any,
  ): Promise<Employee> {
        const newEmployee = this.employeeRepository.create(createEmployeeDto);
        
      console.log("Request ... ",req.user.email);
      
      const created_by=req.user.email;
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(createEmployeeDto.email)) {
          throw new Error('Invalid email format. Please enter a valid email address.');
        }
      
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(createEmployeeDto.mobile_number)) {
          throw new Error('Invalid mobile number format. Please enter a valid phone number.');
        }
      
        // newEmployee.name = createEmployeeDto.name;
        // newEmployee.email = createEmployeeDto.email;
        // newEmployee.mobile_number = createEmployeeDto.mobile_number;
        // newEmployee.department_id = createEmployeeDto.department_id;
        // newEmployee.role = createEmployeeDto.role;
    newEmployee.created_by = created_by;

    if (createEmployeeDto.role === 'Admin') {
          newEmployee.manager_id = null;
        } else {
          newEmployee.manager_id = createEmployeeDto.manager_id;
        }
        
          
        return await this.employeeRepository.save(newEmployee);
        
      }
      

    //Update employee using id
    async updateEmployee(id: number, updatedEmployeeDetails: UpdateEmployeeDto,req : any): Promise<Employee> {
        const employee = await this.employeeRepository.findOneBy({ id });
        if (!employee) {
            throw new NotFoundException('Employee not found.');
        }

        for (const key in updatedEmployeeDetails) {
            if (updatedEmployeeDetails[key] !== undefined) {
                employee[key] = updatedEmployeeDetails[key];
            }
        }
       employee.updated_by=req.user.email;
        return await this.employeeRepository.save(employee);
    }

    //Delete employee using id
    async deleteEmployee(id: number,req:any) {
        const employee = await this.employeeRepository.findOneBy({ id })
        if (!employee) {
            throw new NotFoundException('Employee not found.');
        }
        employee.deleted= true;
        employee.deleted_by=req.user.email;
        // return await this.employeeRepository.remove(employee);
        await this.employeeRepository.save(employee);
    }

    async deleteDepartment(id: number) {
        const department = await this.departmentRepository.findOneBy({ id })
        if (!department) {
            throw new NotFoundException('Department not found.');
        }
        return await this.departmentRepository.remove(department);
    }

    //Show Employe Profile
    async showProfile(id: number) {
        return this.employeeRepository.findOneBy({ id });
    }

    //Show Employee List
  async findEmployees() {
    try {
      return await this.employeeRepository.find({ where: { deleted: false } });
    } catch (error) {
            throw new HttpException('Unable to find employee.',HttpStatus.BAD_REQUEST)
        }
    }
}