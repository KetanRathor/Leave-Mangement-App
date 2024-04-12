import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entity/Department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}
  // Create Department
  async createDepartment(
    departmentName: CreateDepartmentDto,
    // req_mail: string,
  ) {
    const dept = this.departmentRepository.create(departmentName);
    // dept.created_by = req_mail;
    return await this.departmentRepository.save(dept);
  }

  //delete department

  async deleteDepartment(id: number, req_mail: string) {
    const department = await this.departmentRepository.findOneBy({ id });
    if (!department) {
      throw new NotFoundException('Department not found.');
    }
    department.deleted_by = req_mail;
    return await this.departmentRepository.remove(department);
  }


  async findDepartmentList(){
    return await this.departmentRepository.find()

  }
}
