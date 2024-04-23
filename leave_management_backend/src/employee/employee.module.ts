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
import { InventoryService } from 'src/inventory/inventory.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Category } from 'src/inventory/entities/inventoryCategory.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Employee,Department,UserCredentials,Inventory,Category]),MailModule],
  controllers: [EmployeeController],
  providers: [EmployeeService,AuthService,InventoryService],
  exports:[EmployeeService]
})
export class EmployeeModule {}
