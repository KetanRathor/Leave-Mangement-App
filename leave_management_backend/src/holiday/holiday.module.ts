import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { Holidays } from './entities/holiday.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Holidays])],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule {}
