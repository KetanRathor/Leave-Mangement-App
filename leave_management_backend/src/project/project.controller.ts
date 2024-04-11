import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateInventoryDto } from 'src/inventory/dto/update-inventory.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { Project } from './entities/project.entity';
import { AssignProjectDto } from './dto/assign-project.dto';
import { Employee } from 'src/employee/entities/Employee.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService,
    // private readonly employeeService: EmployeeService
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async addProject(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const req_mail = req.user.email;
    try {
      return await this.projectService.addProject(createProjectDto, req_mail);
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }





  @UseGuards(AuthGuard)
  @Get()
  findAllInventories() {
    return this.projectService.showAllProjects();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneProject(@Param('id', ParseIntPipe) id: number) {
    return await this.projectService.findOneProject(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateProject(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    const req_mail = req.user.email
    try {
      return await this.projectService.updateProject(id, updateProjectDto, req_mail);
    } catch (error) {

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @UseGuards(AuthGuard)
  @Post(':adminId')
  async assignProject(@Param('adminId', ParseIntPipe) adminId: number, @Body() { employeeId, projectId }: AssignProjectDto,
  //  @Request() req
  ) {
    // const req_mail = req.user.email;

    try {
      return await this.projectService.assignProject({ adminId, employeeId, projectId });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':projectId/assigned-employees')
async getAssignedEmployees(@Param('projectId') projectId: number): Promise<Employee[]> {
  return await this.projectService.getAssignedEmployees(projectId);
}


}
