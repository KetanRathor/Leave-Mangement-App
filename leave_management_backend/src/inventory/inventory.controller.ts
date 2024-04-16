import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
  ParseIntPipe,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import * as crypto from 'crypto';
import { text } from 'stream/consumers';
import { Inventory } from './entities/inventory.entity';
import { CreateInvetoryCategoryDto } from './dto/create-inventoryCategory.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/inventoryCategory.entity';


@ApiTags('Inventory')
@ApiBearerAuth('JWT-auth')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    // private readonly categoryService: CategoryService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createInventory(
    @Body() createInventoryDto: CreateInventoryDto,
    @Request() req,
  ) {
  @ApiCreatedResponse({
    description:'Inventory will be created as response',
    type:Inventory
  })
  async createInventory(@Body() createInventoryDto: CreateInventoryDto, @Request() req) {
    const req_mail = req.user.email;
    try {
      return await this.inventoryService.createInventory(
        createInventoryDto,
        req_mail,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description:'Get List of all Inventories',
    type:[Inventory]
  })
  findAllInventories() {
    return this.inventoryService.showAllInventories();
  }

  @UseGuards(AuthGuard)
  @Get('oneInventory/:id')
  @ApiOkResponse({
    description:'Get Inventory of given ID',
    type:Inventory
  })
  async findOneInventory(@Param('id', ParseIntPipe) id: number) {
    return await this.inventoryService.findOneInventory(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateInventory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Request() req,
  ) {
  @ApiCreatedResponse({
    description:'Inventory will be updated as response',
    type:Inventory
  })
  async updateInventory(@Param('id', ParseIntPipe) id: number, @Body() updateInventoryDto: UpdateInventoryDto, @Request() req) {
    const req_mail = req.user.email;

    try {
      return await this.inventoryService.updateInventory(
        id,
        updateInventoryDto,
        req_mail,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description:'Inventory will be deleted as response'
  })
  async deleteInventory(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const req_mail = req.user.email;
    return await this.inventoryService.deleteInventory(id, req_mail);
  }

  @UseGuards(AuthGuard)
  @Post('assign/:employeeId')
  async assignInventory(
    @Body() createInventoryDto: CreateInventoryDto,
    @Param('employeeId') employeeId: number,
    @Request() req,
  ) {
    const req_mail = req.user.email;
@Post('assign/:employeeId')
@ApiCreatedResponse({
  description:'Assign Inventory to given Employee Id'
})
async assignInventory(@Body() createInventoryDto: CreateInventoryDto, @Param('employeeId') employeeId: number, @Request() req) {
  const req_mail = req.user.email;

    try {
      const existingInventory =
        await this.inventoryService.findOneInventoryBySN(
          createInventoryDto.serial_number,
        );

      if (existingInventory) {
        return await this.inventoryService.assignInventory({
          inventoryId: existingInventory.id,
          employeeId,
          categoryId: createInventoryDto.category_id,
        });
      } else {
        return { message: 'Inventory not available' };
      }

      // const createdInventory = await this.inventoryService.createInventory(createInventoryDto, req_mail);
      // return await this.inventoryService.assignInventory({ inventoryId: createdInventory.id, employeeId });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('assigned/:employeeId')
  async getAssignedInventory(
    @Param('employeeId') employeeId: number,
  ): Promise<Inventory[]> {
    try {
      const assignedInventory =
        await this.inventoryService.getAssignedInventory(employeeId);
      return assignedInventory;
    } catch (error) {
      throw error;
    }
  }


  

@Get('assigned/:employeeId')
@ApiOkResponse({
  description:'Get list of Inventories assigned to given employee ID',
  type:Inventory
})
async getAssignedInventory(@Param('employeeId') employeeId: number): Promise<Inventory[]> {
  try {
    const assignedInventory = await this.inventoryService.getAssignedInventory(employeeId);
    return assignedInventory;
  } catch (error) {
    throw error;
  }
}

  @UseGuards(AuthGuard)
  @Post('/category')
  async createCategory(
    @Body() createInvetoryCategoryDto: CreateInvetoryCategoryDto,
    @Request() req,
  ) {
    const req_mail = req.user.email;
    try {
      console.log('..................................');

      return await this.inventoryService.createCategory(
        createInvetoryCategoryDto,
        req_mail,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
@UseGuards(AuthGuard)
@Post("/category")
@ApiCreatedResponse({
  description:'Category will be created as response',
  type:Category
})
async createCategory(@Body() createInvetoryCategoryDto: CreateInvetoryCategoryDto, @Request() req) {
  const req_mail = req.user.email;
  try {
    console.log("..................................");
    
    return await this.inventoryService.createCategory(createInvetoryCategoryDto, req_mail);
  }
  catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}


  // @UseGuards(AuthGuard)
  @Get('allCategory')
  @ApiOkResponse({
    description:'Get List Of All Categories of Inventories',
    type:[Category]
  })
  findAllCategory() {
    return this.inventoryService.showAllCategory();
  }
}
