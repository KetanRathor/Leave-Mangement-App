import { ApiProperty } from "@nestjs/swagger";

export class UpdateLeaveTypeDto {
    @ApiProperty({
        description:'leave type name',
        example:"sick leave"
    })
    leave_type_name?: string;
    
    @ApiProperty({
        description:'total leaves for leave type',
        example:15
    })
    default_balance?: number;
}