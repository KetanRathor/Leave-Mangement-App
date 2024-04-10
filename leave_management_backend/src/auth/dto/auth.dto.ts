import { ApiProperty } from "@nestjs/swagger";

export class AuthPayloadDto {

    @ApiProperty({
        description:'Email of Employee',
        example:'abc@gmail.com'
    })
    email: string;

    @ApiProperty({
        description:'password of employee'
    })
    password: string;
}