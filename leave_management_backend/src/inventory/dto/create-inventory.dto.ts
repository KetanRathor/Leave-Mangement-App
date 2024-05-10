import { ApiProperty } from "@nestjs/swagger";

export class CreateInventoryDto {

    @ApiProperty({
        description:'name of inventory',
        example:'Dell'
    })
    name: string;

    @ApiProperty({
        description:'serial no. of inventory',
        example:'D123'
    })
    serial_number:string;

    @ApiProperty({
        description:'category id of inventory',
        example:'1'
    })
    category_id:number;

}
