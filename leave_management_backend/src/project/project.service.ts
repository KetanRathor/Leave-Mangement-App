import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { IsNull, Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { access } from 'fs';

@Injectable()
export class ProjectService {
  constructor
    (
      @InjectRepository(Project)
      private projectRepository: Repository<Project>,

      @InjectRepository(Employee)
      private employeeRepository: Repository<Employee>,
    ) { }

  async addProject(createProjectDto: CreateProjectDto, req_mail: any) {


    const newProject = this.projectRepository.create(createProjectDto);
    newProject.created_by = req_mail;
    const manager = await this.employeeRepository.findOneBy({ id: createProjectDto.manager_id });

    if (!manager) {

      throw new Error('Manager not found for the provided ID');
    }

    newProject.manager = manager
    const newProject1 = await this.projectRepository.save(newProject)
    await this.assignProject({ employeeId: manager.id, projectId: newProject1.id });

    return newProject1

  }

  async showAllProjects() {
    return await this.projectRepository.find({ where: { status: 'active' }, relations: ['manager', 'employee'] });
  }



  // async findOneProject(id: number) {
  //   const project = await this.projectRepository.findOne({
  //     where: { id, status: 'active' },
  //     relations: ['employee', 'manager']
  //   });

  //   if (!project) {
  //     return { message: `Project with ID ${id} is inactive`, project };
  //   }
  //   const activeEmployees = project.employee.filter(emp => emp.deleted_at === null);

  //   const allEmployees = [
  //     { ...project.manager, role: 'manager' },
  //     ...activeEmployees.map(emp => ({ ...emp, role: 'employee' }))
  //   ];
  //   return { ...project, employee: allEmployees };
  // }
  async findOneProject(id: number) {
    const project = await this.projectRepository.findOne({ where: { id, status: 'active' },relations:['employee','manager']});

    if (!project) {
      return { message: `Project with ID ${id} not found`, project };
    }
    return project;
  }



  async updateProject(projectId: number, updateProjectDto: UpdateProjectDto, req_mail: any) {

    const project = await this.projectRepository.findOne({
      relations: {
        employee: true,
      },
      where: { id: projectId }
    });

    if (!project) {
      throw new Error('Project not found for the provided ID');
    }
    Object.assign(project, updateProjectDto);
    project.updated_by = req_mail;

    if (updateProjectDto.manager_id && updateProjectDto.manager_id !== project.manager?.id) {
      const newManager = await this.employeeRepository.findOneBy({ id: updateProjectDto.manager_id });
      if (!newManager) {
        throw new Error('Manager not found for the provided ID');
      }
      project.manager = newManager;
      project.employee = [newManager]


    }
    const updatedProject = await this.projectRepository.save(project);
    return updatedProject;
  }



  async assignProject({ employeeId, projectId }): Promise<string> {
    try {

      const [project, employee] = await Promise.all([
        this.projectRepository.findOne(
          {
            relations: {
              employee: true,
            },
            where: { id: projectId }
          }),
        this.employeeRepository.findOne({ where: { id: employeeId } }),
      ]);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      console.log("project", project)

      project.employee.push(employee);


      await this.projectRepository.save(project);

      return `${project.name} assigned sucessfully to the ${employee.name}.`;
    } catch (error) {
      throw error;
    }
  }


  async getAssignedProjects(employeeId: number): Promise<{ assignedProjects: Project[]; projectCount: number }> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          id: employeeId
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

  async updateProjectStatus(
    projectId: number,
    body: any,
    req_mail: string
  ): Promise<Project> {

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    project.status = body.status;
    project.updated_by = req_mail;

    return await this.projectRepository.save(project);
  }

}


