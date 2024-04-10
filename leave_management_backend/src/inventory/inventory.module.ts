import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory } from './entities/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from 'src/employee/employee.module';
import { Employee } from 'src/employee/entities/Employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory,Employee]),
    // EmployeeModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule { }
