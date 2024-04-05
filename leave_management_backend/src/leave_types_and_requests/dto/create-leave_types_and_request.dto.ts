import { ApiProperty } from "@nestjs/swagger";

export class CreateLeaveTypesAndRequestDto {
  @ApiProperty({
    description:"The id of the employee",
    example:2, 
    })
  emp_id: number;

  @ApiProperty({
    description:"Leave type id",
    example:2,
   })
  leave_type_id: number;

  @ApiProperty({
    description:"Start date for leave",
    example:"2023-05-11",
   })
  start_date: Date;

  @ApiProperty({
    description:"leave end date",
    example:"2023-05-12",
   })
  end_date: Date;

  @ApiProperty({
    description:"The reason for the leave",
    example:"health issue",
   })
  reason: string;

  @ApiProperty({
    description:"The status of the leave request",
    example:"pending",
   })
  status: string;
  
}