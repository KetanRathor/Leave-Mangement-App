import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entity/Department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>
    ) { }
    // Create Department
    async createDepartment(departmentName: CreateDepartmentDto) {
        return await this.departmentRepository.save(departmentName);
    }

    //delete department
    
    async deleteDepartment(id: number) {
        const department = await this.departmentRepository.findOneBy({ id })
        if (!department) {
            throw new NotFoundException('Department not found.');
        }
        return await this.departmentRepository.remove(department);
    }
}
