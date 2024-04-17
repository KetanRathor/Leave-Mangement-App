import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateInventoryDto } from 'src/inventory/dto/update-inventory.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { Project } from './entities/project.entity';
import { AssignProjectDto } from './dto/assign-project.dto';
import { Employee } from 'src/employee/entities/Employee.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
// import { Project } from './entities/project.entity';

@ApiTags('Project')
@ApiBearerAuth('JWT-auth')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    // private readonly employeeService: EmployeeService
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'Project will be added as response',
    type: Project
  })
  async addProject(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const req_mail = req.user.email;
    try {
      return await this.projectService.addProject(createProjectDto, req_mail);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'All project List',
    type: [Project]
  })
  findAllProject() {
    return this.projectService.showAllProjects();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'The project with given ID',
    type: Project
  })
  async findOneProject(@Param('id', ParseIntPipe) id: number) {
    return await this.projectService.findOneProject(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    const req_mail = req.user.email;
    @ApiCreatedResponse({
      description: 'project will be updated as response',
      type: Project
    })
    async updateProject(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
      const req_mail = req.user.email
      try {
        return await this.projectService.updateProject(
          id,
          updateProjectDto,
          req_mail,
        );
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    // @UseGuards(AuthGuard)
    @Post(':adminId')
    async assignProject(
      @Param('adminId', ParseIntPipe) adminId: number,
      @Body() { employeeId, projectId }: AssignProjectDto,
      //  @Request() req
      @ApiCreatedResponse({
        description: 'project will be assigned to employee',
        type: Project
      })
      async assignProject(@Param('adminId', ParseIntPipe) adminId: number, @Body() { employeeId, projectId }: AssignProjectDto,
        //  @Request() req
      ) {
      // const req_mail = req.user.email;

      try {
        return await this.projectService.assignProject({
          adminId,
          employeeId,
          projectId,
        });
      } catch(error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

  @Get(':projectId/assigned-employees')
      async getAssignedEmployees(
        @Param('projectId') projectId: number,
      ): Promise < Employee[] > {
        return await this.projectService.getAssignedEmployees(projectId);
      }
@Get(':projectId/assigned-employees')
      @ApiOkResponse({
        description: 'get list of employees who are assigned the project of given ID'
      })
      async getAssignedEmployees(@Param('projectId') projectId: number): Promise < Employee[] > {
        return await this.projectService.getAssignedEmployees(projectId);
      }

  @UseGuards(AuthGuard)
      @Put('/status/:project_id')
      async this.updateProjectStatus(
        @Param('project_id') project_id: number,
        @Body() body: { status: string },
        @Request() req,
      ): Promise < Project > {
        const req_mail = req.user.email;
        if(!body.status) {
      throw new BadRequestException('Status is required');
    }
    return this.projectService.updateProjectStatus(project_id, body, req_mail);
  }
  @UseGuards(AuthGuard)
  @Put('/status/:project_id')
  @ApiCreatedResponse({
    description: 'status of the project will be updated as response',
    type: Project
  })
  async updateProjectStatus(@Param('project_id') project_id: number, @Body() body: { status: string }, @Request() req,): Promise<Project> {
    const req_mail = req.user.email;
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }
    return this.projectService.updateProjectStatus(project_id, body, req_mail);
  }


}
