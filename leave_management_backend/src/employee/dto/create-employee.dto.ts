// import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDto {
    // @ApiProperty({
    //     description:"The name of the user",
    //     example:"ABC",
    // })
    name: string;

    // @ApiProperty({
    //     description:"The email of the user",
    //     example:"abc@gmail.com",
    // })
    email: string;

    // @ApiProperty({
    //     description:"The contact number of the user",
    //     example:"7654567823",
    // })
    mobile_number: string;

    // @ApiProperty({
    //     description:"The department id of the user",
    //     example:101,
    // })
    department_id: number;

   
    // @ApiProperty({
    //     description:"The role of the user",
    //     example:"employee",
    // })
    role: string;

    // @ApiProperty({
    //     description:"The manager id of the user",
    //     example:12,
    // })
    manager_id?: number;
}