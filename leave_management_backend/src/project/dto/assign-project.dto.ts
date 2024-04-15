import { ApiProperty } from "@nestjs/swagger";

export class AssignProjectDto {

  @ApiProperty({
    description: 'Id of employee'
  })
  employeeId: number;

  @ApiProperty({
    description: 'Id of project'
  })
  projectId: number;
}