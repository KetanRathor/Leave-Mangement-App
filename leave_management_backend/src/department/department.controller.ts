import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Department } from './entity/Department.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
// @ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  // @ApiCreatedResponse({
  //   description: 'created department object as response',
  //   type: Department,
  // })
  // @ApiBadRequestResponse({
  //   description: 'cannot create Department. Try Again',
  // })
  // @UseGuards(AuthGuard)
  @Post()
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    // const req_email = req.user.email;
    try {
      return await this.departmentService.createDepartment(
        createDepartmentDto,
        // req_email,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  // @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteDepartment(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.departmentService.deleteDepartment(id);
      return 'Department Deleted Successfully';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get()
  showDept() {
    return this.departmentService.findDept();
  }
}
