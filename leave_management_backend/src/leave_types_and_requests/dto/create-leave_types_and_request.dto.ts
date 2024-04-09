import { ApiProperty } from "@nestjs/swagger";

export class CreateLeaveTypesAndRequestDto {
  @ApiProperty({
    description:'id of employee',
    example:'1'
  })
  emp_id: number;

  @ApiProperty({
    description:'the type of leave',
    'example':'full'
  })
  leave_type: string;

  @ApiProperty({
    description:'The start date of leave',
   example:'2024-04-10'
  })
  start_date: Date;

  @ApiProperty({
    description:'The end date of leave',
    example:'2024-04-11'
  })
  end_date: Date;

  @ApiProperty({
    description:'the reason for leave',
    example:'health issue'
  })
  reason: string;

  @ApiProperty({
    description:'status of leave request'
  })
  status: string;

  
}