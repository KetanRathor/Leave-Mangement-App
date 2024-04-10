import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { triggerAsyncId } from 'async_hooks';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) { }

  async create(createInventoryDto: CreateInventoryDto, req_mail: any) {
    const newInventory = this.inventoryRepository.create(createInventoryDto);
    newInventory.created_by = req_mail;

    return this.inventoryRepository.save(newInventory);
  }

  async updateInventory(id: number, updatedInventoryDetails: UpdateInventoryDto, req_mail: any): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOneBy({ id });

    if (!inventory) {
      throw new NotFoundException('Inventory not found.');
    }

    for (const key in updatedInventoryDetails) {
      if (updatedInventoryDetails[key] !== undefined) {
        inventory[key] = updatedInventoryDetails[key];
      }
    }

    inventory.updated_by = req_mail;

    return await this.inventoryRepository.save(inventory);
  }


  async showAllInventories() {
    return await this.inventoryRepository.find({ where: { deleted_at: IsNull() } });
  }

  async findOneInventory(id: number) {
    const inventory = await this.inventoryRepository.findOne({ where: { id, deleted_at: IsNull() } });

    if (!inventory) {
      return { message: `Inventory with ID ${id} not found`, inventory };
    }

    return inventory;
  }



  async deleteInventory(id: number, req_mail: any): Promise<void> {
    const inventory = await this.inventoryRepository.findOneBy({ id });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    inventory.deleted_by = req_mail;
    inventory.deleted_at = new Date()

    await this.inventoryRepository.save(inventory)

    console.log(`Inventory with ID ${id} deleted by ${req_mail}`);
  }

  async findOneInventoryBySN(serial_number: string): Promise<any> | null {
    try {
      const inventory = await this.inventoryRepository.findOne({ where: { serial_number } });
      return inventory
    } catch (error) {
      console.log("findOneInventoryBySN Error: ", error)
      return null
    }
  }

  async assignInventory({ inventoryId, employeeId }: { inventoryId: number, employeeId: number }) {
    try {
      const [inventory, employee] = await Promise.all([
        this.inventoryRepository.findOne({ where: { id: inventoryId } }),
        this.employeeRepository.findOne({ where: { id: employeeId } }),
      ]);
  
      if (!inventory) {
        throw new NotFoundException('Inventory not found');
      }
  
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const existingAssignment = await this.inventoryRepository.findOne({
        where: { id: inventoryId},relations: ['employee'],
      });
  
      if (existingAssignment && existingAssignment.employee) {
        throw new HttpException('Inventory already assigned to another employee', HttpStatus.BAD_REQUEST);
      }
  
      inventory.employee = employee;
      const updatedInventory = await this.inventoryRepository.save(inventory);
  
      return updatedInventory;
    } catch (error) {
      throw error;
    }

  }

  

  async getAssignedInventory(employeeId: number): Promise<Inventory[]> {
    try {
      const assignedInventory = await this.inventoryRepository.find({
        where: { employee: { id: employeeId } }, 
        select: ['id', 'name'],
        relations: ['employee'],
      });
      return assignedInventory;
    } catch (error) {
      throw error;
    }
  }

  


  

}
