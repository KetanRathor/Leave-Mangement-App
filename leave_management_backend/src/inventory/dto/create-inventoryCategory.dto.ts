import { ApiProperty } from "@nestjs/swagger";

export class CreateInvetoryCategoryDto {
    @ApiProperty({
        description:'Name of the Category',
        example:'laptop'
    })
    name: string;
}
