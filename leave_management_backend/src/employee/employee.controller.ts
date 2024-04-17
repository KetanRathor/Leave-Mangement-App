import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  Get,
  UseGuards,
  Request,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Employee } from './entities/Employee.entity';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'created user object as response',
    type: Employee,
  })
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Request() req,
  ) {
    const req_mail = req.user.email;
    try {
      return await this.employeeService.createEmployee(
        createEmployeeDto,
        req_mail,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiCreatedResponse({
    description: 'Employee with given ID will be updated as response',
    type: Employee,
  })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Request() req,
  ) {
    const req_mail = req.user.email;
    try {
      return await this.employeeService.updateEmployee(
        id,
        updateEmployeeDto,
        req_mail,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Employee with given ID will be deleted as response',
  })
  async deleteEmployee(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const req_mail = req.user.email;
    try {
      await this.employeeService.deleteEmployee(id, req_mail);
      return 'Employee Deleted Successfully';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //Show Profile or display employee details
  @UseGuards(AuthGuard)
  @Get('employee/:id')
  @ApiOkResponse({
    description: 'Get employee by id',
    type: Employee,
  })
  async showProfile(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.employeeService.showProfile(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'All employees List',
    type: [Employee],
  })
  showEmployeeList() {
    return this.employeeService.findEmployees();
  }

  // @Get('/manager')
  // async showManagerList() {
  //   console.log("first..............")
  //   return await this.employeeService.findManagerList();
  // }

  @Post('upload-image/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new Error('No image uploaded');
    }

    const employee = await this.employeeService.uploadImage(id, image.buffer);

    return employee;
  }
}
