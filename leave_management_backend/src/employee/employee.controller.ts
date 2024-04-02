import { Controller, Post, Body, HttpException, HttpStatus, Put, Param, ParseIntPipe, Delete, Get, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      return await this.employeeService.createEmployee(createEmployeeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  
  @Put(':id')
  async updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    try {
      return await this.employeeService.updateEmployee(id, updateEmployeeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.employeeService.deleteEmployee(id);
      return 'Employee Deleted Successfully'
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
 
  //Show Profile or display employee details
  @Get(':id')
  async showProfile(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.employeeService.showProfile(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
  
  // @UseGuards(AuthGuard)
  @Get()
  showEmployeeList() {
    return this.employeeService.findEmployees();
  }
}
