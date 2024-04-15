import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Department } from './entity/Department.entity';

@ApiTags('Department')
@ApiBearerAuth("JWT-auth")
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseGuards(AuthGuard)

  @Post()
  @ApiCreatedResponse({
    description: 'created department object as response',
    type: Department,
  })
  
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto,@Request() req) {
    const req_mail=req.user.email;
    try {
      return await this.departmentService.createDepartment(createDepartmentDto,req_mail);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'department will be deleted as response'
  })
  async deleteDepartment(@Param('id', ParseIntPipe) id: number,@Request() req) {
    const req_mail=req.user.email;
    try {
      await this.departmentService.deleteDepartment(id,req_mail);
      return 'Department Deleted Successfully';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
