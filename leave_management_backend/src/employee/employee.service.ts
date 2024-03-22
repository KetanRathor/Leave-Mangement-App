import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/Employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { Department } from './entities/Department.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/Employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>
    ) { }

// Create Department
    async createDepartment(departmentName: CreateDepartmentDto) {
        return await this.departmentRepository.save(departmentName);
    }

    //Create employee
    async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const newEmployee = new Employee();
        newEmployee.name = createEmployeeDto.name;
        newEmployee.email = createEmployeeDto.email;
        newEmployee.mobile_number = createEmployeeDto.mobile_number;
        newEmployee.department_id = createEmployeeDto.department_id
        newEmployee.role = createEmployeeDto.role;

        if (createEmployeeDto.role === "Admin") {
            newEmployee.manager_id = null;
        }
        else if (createEmployeeDto.role === "Manager") {
            newEmployee.manager_id = 1;
        }
        else {
            newEmployee.manager_id = createEmployeeDto.manager_id;
        }

        // if (createEmployeeDto.role === 'Employee') {
        //     newEmployee.manager_id = createEmployeeDto.manager_id;
        // }

        return await this.employeeRepository.save(newEmployee);
    }

    //Update employee using id
    async updateEmployee(e_id: number, updatedEmployeeDetails: UpdateEmployeeDto): Promise<Employee> {
        const employee = await this.employeeRepository.findOneBy({ e_id });
        if (!employee) {
            throw new NotFoundException('Employee not found.');
        }

        // employee.name = updatedEmployeeDetails.name;
        // employee.email = updatedEmployeeDetails.email;
        // employee.mobile_number = updatedEmployeeDetails.mobile_number;
        // employee.role = updatedEmployeeDetails.role;
        // employee.manager_id = updatedEmployeeDetails.manager_id;
        // employee.department_id = updatedEmployeeDetails.department_id;

        for (const key in updatedEmployeeDetails) {
            if (updatedEmployeeDetails[key] !== undefined) {
                employee[key] = updatedEmployeeDetails[key];
            }
        }


        return await this.employeeRepository.save(employee);
    }

    //Delete employee using id
    async deleteEmployee(e_id: number) {
        const employee = await this.employeeRepository.findOneBy({ e_id })
        if (!employee) {
            throw new NotFoundException('Employee not found.');
        }
        return await this.employeeRepository.remove(employee);
    }

    //Show Employe Profile
    async showProfile(e_id: number) {
        return this.employeeRepository.findOneBy({ e_id });
    }

}