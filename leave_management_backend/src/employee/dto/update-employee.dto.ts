import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { ApiProperty } from '@nestjs/swagger';

// export class UpdateEmployeeDto  {
//     @ApiProperty({
//         description:"The name of the employee",
//         example:"ABC",
//     })
//     name: string;

//     @ApiProperty({
//         description:"The email of the employee",
//         example:"abc@gmail.com",
//     })
//     email: string;

//     @ApiProperty({
//         description:"The contact number of the employee",
//         example:"7654567823",
//     })
//     mobile_number: string;

//     @ApiProperty({
//         description:"The department id of the employee",
//         example:1,
//     })
//     department_id: number;

//     @ApiProperty({
//         description:"The role of the employee",
//         example:"employee",
//     })
//     role: string;

//     @ApiProperty({
//         description:"The manager id of the employee",
//         example:1,
//     })
//     manager_id?: number;
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
// }
