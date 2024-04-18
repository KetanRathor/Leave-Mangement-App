import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
    @ApiProperty({
        description:'name of inventory'
    })
    name: string;

    @ApiProperty({
        description:'serial no. of inventory'
    })
    serial_number:string;


}
