import { Controller, Post, Body, HttpException, HttpStatus, Put, Param, ParseIntPipe, Delete, Get, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  @ApiCreatedResponse({
    description: 'created user object as response',
    type: Employee,
  })
  @ApiBadRequestResponse({
    description:'User cannot register. Try Again'
  })
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      return await this.employeeService.createEmployee(createEmployeeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  
  // @UseGuards(AuthGuard)
  // @Post('/department')
  // async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
  //   try {
  //     return await this.employeeService.createDepartment(createDepartmentDto);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @UseGuards(AuthGuard)
  @Put(':id')
  
  async updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    try {
      return await this.employeeService.updateEmployee(id, updateEmployeeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)

  @Delete(':id')
  
  async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.employeeService.deleteEmployee(id);
      return 'Employee Deleted Successfully'
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
 
  // @UseGuards(AuthGuard)

  // @Delete('/department/:id')
  // async deleteDepartment(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //     await this.employeeService.deleteDepartment(id);
  //     return 'Department Deleted Successfully'
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
  //   }
  // }
 

  //Show Profile or display employee details
  @UseGuards(AuthGuard)

  @Get(':id')
  async showProfile(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.employeeService.showProfile(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
  
  @UseGuards(AuthGuard)
  @Get()
  showEmployeeList() {
    return this.employeeService.findEmployees();
  }
}
