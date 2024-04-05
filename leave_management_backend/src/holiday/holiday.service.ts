import { Injectable, NotFoundException } from '@nestjs/common';
import { Holidays } from './entities/holiday.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHolidaysDto } from './dto/createHolidays.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holidays)
    private readonly holidayRepository: Repository<Holidays>,
  ) {}

  findAll() {
    return this.holidayRepository.find();
  }

  async createHoliday(createHolidayDto: CreateHolidaysDto): Promise<Holidays> {
    const newHoliday = this.holidayRepository.create(createHolidayDto);
    return await this.holidayRepository.save(newHoliday);
  }

  async deleteHoliday(id: number) {
    const holiday = await this.holidayRepository.findOneBy({ id });
    if (!holiday) {
      throw new NotFoundException('holiday not found.');
    }
    return await this.holidayRepository.remove(holiday);
  }
}
