import { ApiProperty } from '@nestjs/swagger';

export class CreateInvetoryCategoryDto {
  name: string;
  @ApiProperty({
    description: 'Name of the Category',
  })
  name: string;
}
