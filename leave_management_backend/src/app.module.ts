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
// import { DepartmentController } from './department/department.controller';
// import { DepartmentService } from './department/department.service';
import { DepartmentModule } from './department/department.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
// import { MyRedisModule } from './redis/redis.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProjectModule } from './project/project.module';
// import { HolidaysModule } from './holidays/holidays.module';
// import { ProjectModule } from './project/project.module';
import { HolidaysModule } from './holidays/holidays.module';



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
    MailModule,
    InventoryModule,
    ProjectModule,
    // HolidaysModule
    // ProjectModule,
    HolidaysModule
    // MyRedisModule.register({
    //   host: 'localhost', // Redis host
    //   port: 6379, // Redis port
    //   // other configuration options if needed
    // }),
    // RedisModule,
  ],
  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule { }