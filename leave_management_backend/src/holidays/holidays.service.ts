import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holidays } from './entities/holidays.entity';

@Injectable()
export class HolidaysService {
  holidaysService: any;
  constructor(
    @InjectRepository(Holidays)
    private readonly holidaysRepository: Repository<Holidays>,
  ) {}

  async uploadImage(
    date: Date,
    day: string,
    occasion: string,
    image: Buffer,
  ): Promise<Holidays> {

    const newHoliday = this.holidaysRepository.create({
      date: date,
      day: day,
      occasion: occasion,
      image: image,
    });

    return await this.holidaysRepository.save(newHoliday);
  }

  async getAllHolidays(): Promise<Holidays[]> {
    return await this.holidaysRepository.find();
  }



  async updateHoliday(id: number, holidayData: Holidays): Promise<Holidays | null> {
    const existingHoliday = await this.holidaysRepository.findOneBy({ id });
    if (!existingHoliday) {
      return null;
    }
  
    existingHoliday.date = holidayData.date;
    existingHoliday.day = holidayData.day;
    existingHoliday.occasion = holidayData.occasion;
    existingHoliday.image = holidayData.image; 
  
    return await this.holidaysRepository.save(existingHoliday);
  }

//   async getImagePathById(id: number): Promise<string | null> {
//     // Assuming HolidaysService has a method to get image path by ID
//     const holiday = await this.holidaysService.getHolidayById(id);

//     if (!holiday || !holiday.image) {
//       return null;
//     }

//     return holiday.image; // Assuming 'image' is the property in the Holiday entity that stores the image filename or path
//   }


}
