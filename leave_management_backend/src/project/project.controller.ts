import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards ,Request,
    Req,} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ProjectDto } from './dto/project.dto';
import { Project } from './entity/project.entity';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiBearerAuth()
@ApiTags('Project')
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @UseGuards(AuthGuard)
    @Post()
    @ApiCreatedResponse({
        description: 'The project has been successfully created.',
        type: Project
    })
    async createProject(@Body() projectDto: ProjectDto,@Request() req,): Promise<Project> {
        const req_mail = req.user.email;
        try {
            const createdProject = await this.projectService.createProject(projectDto,
                req_mail,
            );
            return createdProject;
        } catch (error) {
            throw new HttpException('Failed to create project', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
 
    @UseGuards(AuthGuard)
    @Put(':id')
    @ApiCreatedResponse({
        description: 'update project details as response',
        type: Project
    })
    async updateProject(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProjectDto: UpdateProjectDto,@Request() req,
    ) {
        const req_mail = req.user.email;

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

    @UseGuards(AuthGuard)
    @Get()
    @ApiCreatedResponse({
        description:'Get all projects List',
        type:Project
    })
    async findAll(): Promise<Project[]> {
        return this.projectService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiCreatedResponse({
        description: 'Get project by given id',
        type: Project
    })
    async viewProject(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.projectService.viewProject(id);
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiCreatedResponse({
        description:'delete project as response'
    })
    async deleteProject(@Param('id', ParseIntPipe) id: number,@Request() req,) {
        const req_mail = req.user.email;

        try {
            await this.projectService.deleteProject(id,req_mail,)
            return 'Project Deleted Successfully';
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


}

