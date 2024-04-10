import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
constructor
(@InjectRepository(Project)
private projectRepository: Repository<Project>,){}

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


  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
