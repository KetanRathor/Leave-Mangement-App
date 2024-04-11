import { ApiProperty } from "@nestjs/swagger";

export class CreateHolidaysDto {
  @ApiProperty({
    description:'occasion date',
    example:'2024-01-01'
  })
  date: Date;

  @ApiProperty({
    description:'day of occasion',
    example:'monday'
  })
  day: string;

  @ApiProperty({
    description:'occasion name',
    example:'New Year'
  })
  occasion: string;
}
