import { ApiProperty } from "@nestjs/swagger";

export class CreateInventoryDto {

    @ApiProperty({
        description:'name of inventory'
    })
    name: string;

    @ApiProperty({
        description:'serial no. of inventory'
    })
    serial_number:string;
    category_id:number;

}
