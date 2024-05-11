import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
    name: string;

    @ApiProperty({
      description:'manager name of the project'
    })
    manager_id:number;

    @ApiProperty({
      description:'description of the project'
    })
    description: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
    // manager_name?: string; 
  }