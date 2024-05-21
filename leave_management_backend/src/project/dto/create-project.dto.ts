import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({
    description:'name of the project'
  })
    name: string;

    @ApiProperty({
      description:'manager name of the project'
    })
    manager_id:number;

    @ApiProperty({
      description:'description of the project'
    })
    description: string;

    @ApiProperty({
      description:'start date of the project'
    })
    start_date: Date;

    @ApiProperty({
      description:'end date of the project'
    })
    end_date?: Date;

    @ApiProperty({
      description:'status of the project'
    })
    status: 'active' | 'inactive';
    
  }