import { ApiProperty } from "@nestjs/swagger";

export class CreateLeaveTypeDto{


    @ApiProperty({
        description:'leave type name',
        example:"full day"
    })
    leave_type_name : string;

    @ApiProperty({
        description:'total leaves',
        example:20
    })
    default_balance : number;
}