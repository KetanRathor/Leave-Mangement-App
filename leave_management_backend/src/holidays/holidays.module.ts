import { Module } from '@nestjs/common';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import { Holidays } from './entities/holidays.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Holidays])],
  controllers: [HolidaysController],
  providers: [HolidaysService]
})
export class HolidaysModule {}
