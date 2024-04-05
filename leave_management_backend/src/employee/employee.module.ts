import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/Employee.entity';
// import { Department } from './entities/Department.entity';
import { Department } from 'src/department/entity/Department.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentials } from '../auth/entities/UserCredentials.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports : [TypeOrmModule.forFeature([Employee,Department,UserCredentials]),MailModule],
  controllers: [EmployeeController],
  providers: [EmployeeService,AuthService],
  exports:[EmployeeService]
})
export class EmployeeModule {}
