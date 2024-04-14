import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Holidays } from './entities/holidays.entity';

@Injectable()
export class HolidaysService {
  holidaysService: any;
  constructor(
    @InjectRepository(Holidays)
    private readonly holidaysRepository: Repository<Holidays>,
  ) { }

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

    console.log("newHoliday...........", newHoliday)

    return await this.holidaysRepository.save(newHoliday);
  }

  async getAllHolidays(): Promise<Holidays[]> {
    return await this.holidaysRepository.find();
  }

  async total_holidays(): Promise<number> {
    const today = new Date();
    const currentYear = today.getFullYear();

    const startDate = new Date(currentYear, 3, 1);
    if (today.getMonth() < 3) {
      startDate.setFullYear(currentYear - 1);
    }

    const nextYear = currentYear + 1;
    const upcomingApril1st = new Date(nextYear, 3, 1);

    const holidaysCount = await this.holidaysRepository.count({
      where: {
        date: Between(startDate, upcomingApril1st),
      },
    });
    return holidaysCount;
  }

  async holidaysCount(): Promise<number> {
    const today = new Date();
    const currentYear = today.getFullYear();

    const startDate = new Date(currentYear, 3, 1);
    if (today.getMonth() < 3) {
      startDate.setFullYear(currentYear - 1);
    }

    const endDate = today;

    return await this.holidaysRepository.count({
      where: {
        date: Between(startDate, endDate),
      },
    });
  }


  async getHolidayCounts() {

    const total_holidays = await this.total_holidays();
    const holidaysCount = await this.holidaysCount();

    console.log(`List of holidays from recent April 1st to upcoming April 1st: `, total_holidays);

    console.log(`Count of holidays from recent April 1st to today: ${holidaysCount}`);

    return { total_holidays: total_holidays, recent_holidays: holidaysCount };
  }



  async updateHoliday(holidayData: Holidays): Promise<Holidays | null> {
    const existingHoliday = await this.holidaysRepository.findOne({ where: { id: holidayData.id } });
    // console.log("==========================",existingHoliday)
    if (!existingHoliday) {
      console.log("==========================", existingHoliday)
      return null;
    }

    existingHoliday.date = holidayData.date;
    existingHoliday.day = holidayData.day;
    existingHoliday.occasion = holidayData.occasion;
    existingHoliday.image = holidayData.image;


    console.log(holidayData.date, "1111111111111", holidayData.day, "22222222222", holidayData.occasion, "33333333333333", holidayData.image)
    return await this.holidaysRepository.save(existingHoliday);
  }
  // async updateHoliday(id: number, holidayData: Partial<Holidays>): Promise<Holidays | null> {
  //   const existingHoliday = await this.holidaysRepository.findOneBy({ id });
  //   // console.log("==========================", existingHoliday);
  //   if (!existingHoliday) {
  //     return null; // Return null if holiday with the given id is not found
  //   }

  //   // Update only the provided properties of the existing holiday
  //   Object.assign(existingHoliday, holidayData);

  //   console.log("holidayData", holidayData)
  //   console.log("existingHoliday", existingHoliday)

  //   try {
  //     // Save the updated holiday entity
  //     return await this.holidaysRepository.save(existingHoliday);
  //   } catch (error) {
  //     console.error("Error updating holiday:", error);
  //     return null; // Return null if an error occurs during saving
  //   }
  // }


  //   async getImagePathById(id: number): Promise<string | null> {
  //     // Assuming HolidaysService has a method to get image path by ID
  //     const holiday = await this.holidaysService.getHolidayById(id);

  //     if (!holiday || !holiday.image) {
  //       return null;
  //     }

  //     return holiday.image; // Assuming 'image' is the property in the Holiday entity that stores the image filename or path
  //   }


}
