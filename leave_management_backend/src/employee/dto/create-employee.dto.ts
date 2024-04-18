import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDto {
    @ApiProperty({
        description:"The name of the employee",
        example:"ABC",
    })
    name: string;

    @ApiProperty({
        description:"The email of the employee",
        example:"abc@gmail.com",
    })
    email: string;

    @ApiProperty({
        description:"The contact number of the employee",
        example:"7654567823",
    })
    mobile_number: string;

    @ApiProperty({
        description:"The department id of the employee",
        example:1,
    })
    department_id: number;

   
    // @ApiProperty({
    //     description:"The role of the employee",
    //     example:"employee",
    // })
    // role: string;

    @ApiProperty({
        description:"The date of birth of employee",
        example:"2003-05-08",
    })
    dob: Date;

    // @ApiProperty({
    //     description:"The gender of the employee",
    //     example:"female",
    // })
    // gender: string;

    @ApiProperty({
        description:"The gender of the employee (Male/Female/Other)",
        example:"Female",
    })
    gender: string;
    

    @ApiProperty({
        description:"The manager id of the employee",
        example:1,
    })
    manager_id?: number;
}