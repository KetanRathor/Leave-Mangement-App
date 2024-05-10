import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { IsNull, Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { access } from 'fs';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async addProject(createProjectDto: CreateProjectDto, req_mail: any) {
    const newProject = this.projectRepository.create(createProjectDto);
    newProject.created_by = req_mail;
    const manager = await this.employeeRepository.findOneBy({
      id: createProjectDto.manager_id,
    });

    if (!manager) {
      throw new Error('Manager not found for the provided ID');
    }

    newProject.manager = manager;
    const newProject1 = await this.projectRepository.save(newProject);
    await this.assignProject({
      employeeId: manager.id,
      projectId: newProject1.id,
    });

    return newProject1;
  }

  async showAllProjects() {
    return await this.projectRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['employee', 'manager'],
    });
  }

  async findOneProject(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['employee', 'manager'],
    });

    if (!project) {
      return { message: `Project with ID ${id} not found`, project };
    }
    return project;
  }

  async updateProject(
    id: number,
    updatedProjectDetails: UpdateProjectDto,
    req_mail: any,
  ): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (updatedProjectDetails.manager_id) {
      const manager_id = updatedProjectDetails.manager_id;
      const manager = await this.employeeRepository.findOneBy({
        id: manager_id,
      });
      project.manager = manager;
    } else {
      for (const key in updatedProjectDetails) {
        if (updatedProjectDetails[key] !== undefined) {
          project[key] = updatedProjectDetails[key];
        }
      }
    }

    // console.log("manager",manager);
    // console.log("first")

    project.updated_by = req_mail;

    console.log('project....', project);

    const res = await this.projectRepository.save(project);
    console.log(res);

    return res;
  }

  async assignProject({ employeeId, projectId }): Promise<string> {
    try {
      const [project, employee] = await Promise.all([
        this.projectRepository.findOne({
          relations: {
            employee: true,
          },
          where: { id: projectId },
        }),
        this.employeeRepository.findOne({ where: { id: employeeId } }),
      ]);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      console.log('project', project);

      project.employee.push(employee);

      await this.projectRepository.save(project);

      return `${project.name} assigned sucessfully to the ${employee.name}.`;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedProjects(
    employeeId: number,
  ): Promise<{ assignedProjects: Project[]; projectCount: number }> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          id: employeeId,
        },
        relations: ['projects'],
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      return {
        assignedProjects: employee.projects,
        projectCount: employee.projects.length,
      };
    } catch (error) {
      throw error;
    }
  }

  // async updateProjectStatus(
  //   project_id: number,
  //   status: string,
  //   req_mail:string,
  // ): Promise<Project> {
  //   const project = await this.findOne(project_id);
  //   project.status = status;
  //   project.updated_by=req_mail;
  //   return this.projectRepository.save(project);
  // }

  async updateProjectStatus(
    projectId: number,
    body: any,
    req_mail: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, deleted_at: IsNull() },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    project.status = body.status;
    project.updated_by = req_mail;

    return await this.projectRepository.save(project);
  }
}
