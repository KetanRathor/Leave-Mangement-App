import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { ConfigModule } from '@nestjs/config';
import { LeaveTypesAndRequestsModule } from './leave_types_and_requests/leave_types_and_requests.module';
import { AuthModule } from './auth/auth.module';
// import { DepartmentController } from './department/department.controller';
// import { DepartmentService } from './department/department.service';
import { DepartmentModule } from './department/department.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EmployeeModule,
    LeaveTypesAndRequestsModule,
    AuthModule,
    DepartmentModule,
    MailModule
  ],
  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule { }