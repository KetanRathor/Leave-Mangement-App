import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  //   @ApiProperty({
  //     description: 'The name of the department',
  //     example: 'Testing',
  //   })
  department_name: string;
}
