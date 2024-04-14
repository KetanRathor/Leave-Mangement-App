import { Module } from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { LeaveTypesAndRequestsController } from './leave_types_and_requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/LeaveRequest.entity';
import { HolidaysService } from 'src/holidays/holidays.service';
import { Holidays } from 'src/holidays/entities/holidays.entity';
// import { LeaveType } from './entities/LeaveType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest,Holidays])],
  controllers: [LeaveTypesAndRequestsController],
  providers: [LeaveTypesAndRequestsService,HolidaysService],
})
export class LeaveTypesAndRequestsModule {}
