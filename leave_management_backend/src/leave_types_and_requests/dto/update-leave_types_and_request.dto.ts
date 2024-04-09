import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveTypesAndRequestDto } from './create-leave_types_and_request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLeaveTypesAndRequestDto {
    @ApiProperty({
        description:'id of employee'
      })
      emp_id: number;
    
      @ApiProperty({
        description:'the type of leave'
      })
      leave_type: any;
    
      @ApiProperty({
        description:'The start date of leave'
      })
      start_date: Date;
    
      @ApiProperty({
        description:'The end date of leave'
      })
      end_date: Date;
    
      @ApiProperty({
        description:'the reason for leave'
      })
      reason: string;
    
      @ApiProperty({
        description:'status of leave request'
      })
      status: string;
}
