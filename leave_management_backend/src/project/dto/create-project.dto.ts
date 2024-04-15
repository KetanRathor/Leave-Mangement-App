import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {

  @ApiProperty({
    description:'name of the project'
  })
  name: string;

  @ApiProperty({
    description:'description about project'
  })
  description: string;

  @ApiProperty({
    description:'start date of project'
  })
  startDate: Date;

  @ApiProperty({
    description:'end date of project'
  })
  endDate?: Date;

  @ApiProperty({
    description:'status of project'
  })
  status: 'active' | 'inactive';

  @ApiProperty({
    description:'manager name of project'
  })
  managerName?: string;
}