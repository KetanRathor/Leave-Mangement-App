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

  addProject(createProjectDto: CreateProjectDto, req_mail: any) {
    const newProject = this.projectRepository.create(createProjectDto);
    newProject.created_by = req_mail;

    return this.projectRepository.save(newProject)
  }

  async showAllProjects() {
    return await this.projectRepository.find({ where: { deleted_at: IsNull() },relations:['employee'] });
  }

  async findOneProject(id: number) {
    const project = await this.projectRepository.findOne({ where: { id, deleted_at: IsNull() },relations:['employee'] });

    if (!project) {
      return { message: `Inventory with ID ${id} not found`, project };
    }

    return project;
  }

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

  async assignProject({employeeId, projectId }): Promise<string> {
    try {
      // const admin = await this.employeeRepository.findOne({ where: { id: adminId } });

      // if (admin.role !== "Admin") {
      //   throw new NotFoundException("Current user doesn't have admin access");
      // }
      // console.log("Admin", admin)

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
      // project.projects = [employee]
      // console.log("project111", project.projects)
      project.employee.push(employee);
      // project.projects = [...project.projects, employee];

      await this.projectRepository.save(project);

      return `${project.name} assigned sucessfully to the ${employee.name}.`;
    } catch (error) {
      throw error;
    }
  }


  // async getEmployeesOnProject(id: number){

  // }
  async getAssignedEmployees(projectsId: number): Promise<Employee[]> {
    try {
      const project = await this.projectRepository.findOne({
        where:{id: projectsId},
        relations: ['projects'], 
      });
  
      if (!project) {
        throw new NotFoundException('Project not found');
      }
  
      return project.employee; 
    } catch (error) {
      throw error;
    }
  }



  // async getAssignedProjects(employeeId: number): Promise<{ assignedProjects: Project[]; projectCount: number }> {
  //   try {
  //     const employee = await this.employeeRepository.findOne({where:{
  //       id: employeeId},
  //       relations: ['projects'], 
  //     });

  //     if (!employee) {
  //       throw new NotFoundException('Employee not found');
  //     }

  //     return {
  //       assignedProjects: employee.projects, 
  //       projectCount: employee.projects.length, 
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }



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
  body : any,
  req_mail: string
): Promise<Project> {
  
  const project = await this.projectRepository.findOne({ where: { id: projectId, deleted_at: IsNull() } });
  if (!project) {
    throw new NotFoundException('Project not found');
  }
  project.status = body.status;
  project.updated_by = req_mail;
  
  return await this.projectRepository.save(project);
}

}


