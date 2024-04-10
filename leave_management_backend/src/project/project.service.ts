import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from './entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    showProject(id: number) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) { }

    async createProject(projectDto: ProjectDto, req_mail: any): Promise<Project> {
        const project = this.projectRepository.create(projectDto);
        project.created_by = req_mail;
        return this.projectRepository.save(project);

    }

    async updateProject(
        id: number,
        updatedProjectDetails: UpdateProjectDto,
        req_mail,

    ): Promise<Project> {
        const Project = await this.projectRepository.findOneBy({ id });
        if (!Project) {
            throw new NotFoundException('Project not found.');
        }

        for (const key in updatedProjectDetails) {
            if (updatedProjectDetails[key] !== undefined) {
                Project[key] = updatedProjectDetails[key];
            }
        }
        Project.updated_by = req_mail;
        Project.updated_at = new Date();
        return await this.projectRepository.save(Project);
    }

    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find({
            where: { deleted_at: IsNull() },
          });
    }

    async viewProject(id: number) {
        const project = this.projectRepository.findOneBy({ id });
        return project;
    }


    async deleteProject(id: number, req_mail,) {
        const project = await this.projectRepository.findOneBy({ id })
        project.deleted_by = req_mail;
        project.deleted_at = new Date();
        return this.projectRepository.save(project)

    }




}
