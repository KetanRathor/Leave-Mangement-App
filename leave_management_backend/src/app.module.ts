import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { ManagerModule } from './manager/manager.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [DatabaseModule, EmployeeModule, ManagerModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//testing