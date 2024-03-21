import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/Employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository : Repository<Employee>,
    ){}
    
    async create(createEmployeeDto:CreateEmployeeDto){
        const newEmployee = this.employeeRepository.create(createEmployeeDto);
        return this.employeeRepository.save(newEmployee)
    }
}
