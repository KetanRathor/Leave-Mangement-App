import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { IsNull, Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';

@Injectable()
export class ProjectService {
constructor
(
  
  @InjectRepository(Project)
    private projectRepository: Repository<Project>,

  @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  
  ){}

  addProject(createProjectDto: CreateProjectDto,req_mail: any) {
    const newProject = this.projectRepository.create(createProjectDto);
    newProject.created_by = req_mail;

    return this.projectRepository.save(newProject)
  }

  



  async showAllProjects() {
    return await this.projectRepository.find({ where: { deleted_at: IsNull() } });
  }

  async findOneProject(id: number) {
    const project = await this.projectRepository.findOne({ where: { id, deleted_at: IsNull() } });

    if (!project) {
      return { message: `Inventory with ID ${id} not found`, project };
    }

    return project;
  }

  // updateProject(id: number, updateProjectDto: UpdateProjectDto,req_mail: any) {
  //   return `This action updates a #${id} project`;
  // }



  async updateProject(id: number, updatedProjectDetails: UpdateProjectDto, req_mail: any): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException('Inventory not found.');
    }

    for (const key in updatedProjectDetails) {
      if (updatedProjectDetails[key] !== undefined) {
        project[key] = updatedProjectDetails[key];
      }
    }

    project.updated_by = req_mail;

    return await this.projectRepository.save(project);
  }


  // remove(id: number) {
  //   return `This action removes a #${id} project`;
  // }

  // async assignProjectByName(employeeId: number, projectName: string): Promise<Project | undefined> {
  //   const employee = await this.employeeRepository.findOne({
  //     where: { id: employeeId },
  //   });

  //   if (!employee) {
  //     throw new NotFoundException('Employee not found');
  //   }

  //   const project = await this.projectRepository.findOne({
  //     where: { name: projectName },
  //   });

  //   if (!project) {
  //     throw new NotFoundException('Project not found');
  //   }

    
  //   const existingAssignment = await this.projectRepository.findOne({
  //     where: { id: project.id, employeeId: Not(employeeId) }, 
  //   });

  //   if (existingAssignment) {
  //     throw new HttpException('Project already assigned to another employee', HttpStatus.BAD_REQUEST);
  //   }

  //   project.employeeId = employeeId; 
  //   await this.projectRepository.save(project);

  //   return project; 
  // }

  // async assignProjectByName(employeeId: number, projectName: string): Promise<Project | undefined> {
  //   const employee = await this.employeeRepository.findOne({
  //     where: { id: employeeId },
  //   });

  //   if (!employee) {
  //     throw new NotFoundException('Employee not found');
  //   }

  //   const project = await this.projectRepository.findOne({
  //     where: { name: projectName }, // Find project by name
  //   });

  //   if (!project) {
  //     throw new NotFoundException('Project not found');
  //   }

  //   const existingAssignment = await this.projectRepository.findOne({
  //     where: { id: project.id, employeeId: Not(employeeId) }, 
  //   });

  //   if (existingAssignment) {
  //     throw new HttpException('Project already assigned to another employee', HttpStatus.BAD_REQUEST);
  //   }

  //   project.employeeId = employeeId; 
  //   await this.projectRepository.save(project);

  //   return project; 
  // }


}


