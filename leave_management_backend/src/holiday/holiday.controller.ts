import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidaysDto } from './dto/createHolidays.dto';

@Controller('holiday')
export class HolidayController {
    constructor(private readonly holidayService:HolidayService){ }
    
    @Get()
    async findAll() {
      return this.holidayService.findAll();
    }

    @Post()
  async createHoliday(@Body() createHolidayDto: CreateHolidaysDto) {
    return await this.holidayService.createHoliday(createHolidayDto);
  }

  @Delete(':id')
  async deleteHoliday(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.holidayService.deleteHoliday(id);
      return 'Holiday Deleted Successfully'
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
  
}
