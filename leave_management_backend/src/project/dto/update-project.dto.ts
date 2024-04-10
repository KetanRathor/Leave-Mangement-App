import { ApiProperty } from "@nestjs/swagger";

export class UpdateProjectDto {
    @ApiProperty({
        description: "The name of the project",
        example: "xyz",
    })
    name: string;

    @ApiProperty({
        description: "The manager of the project",
        example: "sachin ",
    })
    project_manager: string;


    @ApiProperty({
        description: 'start date of project',
        example:'2024-01-01'
    })
    start_date: Date;


    @ApiProperty({
        description: 'end date of project',
        example:'2024-04-01'
    })
    end_date: Date;

    @ApiProperty({
        description: 'status of project',
        example:'active'
    })
    status: string;

    assign: { name: string; age:number}[];



}