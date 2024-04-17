import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Holidays } from './entities/holidays.entity';

@Injectable()
export class HolidaysService {
  holidaysService: any;
  leaveRequestRepository: any;
  constructor(
    @InjectRepository(Holidays)
    private readonly holidaysRepository: Repository<Holidays>,
  ) { }

  async uploadImage(
    date: Date,
    day: string,
    occasion: string,
    image: Buffer,
    req_mail:string
  ): Promise<Holidays> {

    const newHoliday = this.holidaysRepository.create({
      date: date,
      day: day,
      occasion: occasion,
      image: image,
    });

    console.log("newHoliday...........", newHoliday)
    newHoliday.created_by=req_mail;
    return await this.holidaysRepository.save(newHoliday);
   
    
  }

  async getAllHolidays(): Promise<Holidays[]> {
    return await this.holidaysRepository.find();
  }

  async getUpcomingHolidays(currentDate: Date): Promise<{ date: Date, day: string, occasion: string ,image:Buffer}[]> {
    try {
      const upcomingHolidays = await this.holidaysRepository
        .createQueryBuilder('holiday')
        .select(['holiday.date', 'holiday.day', 'holiday.occasion','holiday.image'])
        .where('holiday.date >= :currentDate', { currentDate })
        .orderBy('holiday.date', 'ASC')
        .getRawMany();

      return upcomingHolidays;
    } catch (error) {
      throw new Error('Failed to fetch upcoming holidays');
    }
  }

  async deleteHolidays(id: number) {
    const holiday = await this.holidaysRepository.findOneBy({ id })
    if (!holiday) {
        throw new NotFoundException('Holiday not found.');
    }
     await this.holidaysRepository.remove(holiday);
    return 'Holoday deleted successfully.';
}



async getRemainingHolidays(): Promise<number> {
  try {
    const currentDate = new Date();
    const holidaysUntilCurrentDate = await this.holidaysRepository.count({
      where: {
        date: LessThanOrEqual(currentDate),
      },
    });
    const defaultHolidays = 10; 

    return defaultHolidays - holidaysUntilCurrentDate;
  } catch (error) {
    throw new Error('Failed to calculate remaining holidays');
  }
} 
}
