import { Module } from '@nestjs/common';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';
import { LeaveTypesAndRequestsController } from './leave_types_and_requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/LeaveRequest.entity';
// import { LeaveType } from './entities/LeaveType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest])],
  controllers: [LeaveTypesAndRequestsController],
  providers: [LeaveTypesAndRequestsService],
})
export class LeaveTypesAndRequestsModule {}
