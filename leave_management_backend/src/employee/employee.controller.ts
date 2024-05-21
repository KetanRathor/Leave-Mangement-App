import { Controller, Post, Body, HttpException, HttpStatus, Put, Param, ParseIntPipe, Delete, Get, UseGuards, Request, Req, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/Employee.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleAuthGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';

@ApiTags('Employees')
@ApiBearerAuth("JWT-auth")

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }


  @Put(':id')
  @ApiCreatedResponse({
    description: 'Employee with given ID will be updated as response',
    type: Employee
  })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Request() req,
  ) {
    const req_mail = req.user.user.email;
    // console.log("req.........",req);
    console.log("req.user......", req.user)
    console.log("req_mail.....", req_mail)
    try {
      return await this.employeeService.updateEmployee(id, updateEmployeeDto,
        req_mail
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @Delete(':id')
  @ApiOkResponse({
    description: 'Employee with given ID will be deleted as response'

  })
  async deleteEmployee(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const req_mail = req.user.user.email;
    try {
      await this.employeeService.deleteEmployee(id, req_mail);
      return 'Employee Deleted Successfully'
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //Show Profile or display employee details

  @Get('employee/:id')
  @ApiOkResponse({
    description: 'Get employee by id',
    type: Employee
  })
  async showProfile(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.employeeService.showProfile(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @Get()
  @ApiOkResponse({
    description: 'All employees List',
    type: [Employee]
  })
  showEmployeeList() {
    return this.employeeService.findEmployees();
  }

  @Get('/manager')
  async showManagerList() {
    console.log("first..............")
    return await this.employeeService.getManagerIds();
  }


  @Post('upload-image/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    description: 'Image upload',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@Param('id') id: number, @UploadedFile() image: Express.Multer.File) {

    if (!image) {
      throw new Error('No image uploaded');
    }

    const employee = await this.employeeService.uploadImage(id, image.buffer);

    return employee;
  }




}





