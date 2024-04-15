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


async getRemainingLeaveBalance(id: number): Promise<number> {
  try {
    const approvedRequests = await this.leaveRequestRepository.find({
      where: {
        emp_id: id, 
        status: 'approved',
      },
    });
    let remainingBalance = 21;
    
    approvedRequests.forEach((request) => {
      switch (request.leave_type) {
        case 'full':
          remainingBalance -= 1;
          break;
        case 'first half':
        case 'second half':
          remainingBalance -= 0.5;
          break;
        
      }
    });

    return remainingBalance;

  } catch (error) {
    throw new BadRequestException('Failed to calculate remaining leave balance');
  }
}

async getRemainingHolidays(): Promise<number> {
  try {
    const currentDate = new Date();
    const holidaysUntilCurrentDate = await this.holidaysRepository.count({
      where: {
        date: LessThanOrEqual(currentDate),
      },
    });
    const defaultHolidays = 10; // Default value for total holidays

    return defaultHolidays - holidaysUntilCurrentDate;
  } catch (error) {
    throw new Error('Failed to calculate remaining holidays');
  }
} 
}
