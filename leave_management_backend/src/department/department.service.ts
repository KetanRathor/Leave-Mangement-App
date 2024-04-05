import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
//   async createDepartment(createDepartmentDto: CreateDepartmentDto, req_email) {
//     const newDept = this.departmentRepository.create(this.createDepartment);

//     Departmentepartment.created_by = req_email;
//     return await this.departmentRepository.create(newDept);
//   }
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
    // req_email: string,
  ) {
    const newDept = this.departmentRepository.create(createDepartmentDto);
    // newDept.created_by = req_email; // Set the created_by property

    return await this.departmentRepository.save(newDept); // Save the new department
  }


  //delete department
  async deleteDepartment(id: number) {
    const department = await this.departmentRepository.findOneBy({
      id,
    });
    if (!department) {
      throw new NotFoundException('Department not found.');
    }
    // return await this.departmentRepository.remove(department);
    department.deleted_at = new Date(); // Mark the department as deleted
    return await this.departmentRepository.save(department);
  }
  async findDept() {
    try {
      return await this.departmentRepository.find();
    } catch (error) {
      throw new HttpException(
        'Unable to find employee.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
