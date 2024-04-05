import { Controller, Post,Body, HttpException, HttpStatus, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Department } from './entity/Department.entity';
@ApiTags('department')
@Controller('department')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @ApiCreatedResponse({
    description: 'created department object as response',
    type: Department,
  })
  @ApiBadRequestResponse({
    description:'cannot create Department. Try Again'
  })
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.departmentService.createDepartment(createDepartmentDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteDepartment(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.departmentService.deleteDepartment(id);
      return 'Department Deleted Successfully'
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
