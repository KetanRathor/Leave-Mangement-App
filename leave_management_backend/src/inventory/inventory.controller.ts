import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Request, UseGuards, ParseIntPipe, Put, NotFoundException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import * as crypto from 'crypto'
import { text } from 'stream/consumers';
import { Inventory } from './entities/inventory.entity';



@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService,
    
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async createInventory(@Body() createInventoryDto: CreateInventoryDto, @Request() req) {
    const req_mail = req.user.email;
    try {
      return await this.inventoryService.createInventory(createInventoryDto, req_mail);
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @UseGuards(AuthGuard)
  @Get()
  findAllInventories() {
    return this.inventoryService.showAllInventories();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneInventory(@Param('id', ParseIntPipe) id: number) {
    return await this.inventoryService.findOneInventory(id);
  }


  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateInventory(@Param('id', ParseIntPipe) id: number, @Body() updateInventoryDto: UpdateInventoryDto, @Request() req) {
    const req_mail = req.user.email;

    try {
      return await this.inventoryService.updateInventory(id, updateInventoryDto, req_mail);
    } catch (error) {

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteInventory(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const req_mail = req.user.email;
    return await this.inventoryService.deleteInventory(id, req_mail);
  }


  @UseGuards(AuthGuard)
@Post(':employeeId')
async assignInventory(@Body() createInventoryDto: CreateInventoryDto, @Param('employeeId') employeeId: number, @Request() req) {
  const req_mail = req.user.email;

  try {
    const existingInventory = await this.inventoryService.findOneInventoryBySN(createInventoryDto.serial_number);

    if (existingInventory) {
      return await this.inventoryService.assignInventory({ inventoryId: existingInventory.id, employeeId });
    }

    const createdInventory = await this.inventoryService.createInventory(createInventoryDto, req_mail);
    return await this.inventoryService.assignInventory({ inventoryId: createdInventory.id, employeeId });
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
  }



  

@Get('assigned/:employeeId')
async getAssignedInventory(@Param('employeeId') employeeId: number): Promise<Inventory[]> {
  try {
    const assignedInventory = await this.inventoryService.getAssignedInventory(employeeId);
    return assignedInventory;
  } catch (error) {
    throw error;
  }
}





 





}

  

