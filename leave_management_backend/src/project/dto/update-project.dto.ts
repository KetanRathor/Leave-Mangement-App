import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    // @ApiProperty({
    //     description:'name of the project'
    //   })
    //     name: string;
    
    //     @ApiProperty({
    //       description:'manager name of the project'
    //     })
    //     manager_id:number;
    
    //     @ApiProperty({
    //       description:'description of the project'
    //     })
    //     description: string;
    
    //     @ApiProperty({
    //       description:'start date of the project'
    //     })
    //     startDate: Date;
    
    //     @ApiProperty({
    //       description:'end date of the project'
    //     })
    //     endDate?: Date;
    
    //     @ApiProperty({
    //       description:'status of the project'
    //     })
    //     status: 'active' | 'inactive';
    
}
