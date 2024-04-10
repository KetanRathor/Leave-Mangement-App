import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project')
export class Project {
  
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description:'The id of project'
  })
  id: number;

  
  @Column({ nullable: false })
  @ApiProperty({
    description:'The name of project'
  })
  name: string;

  
  @Column({ nullable: false})
  @ApiProperty({
    description:'The manager of project'
  })
  project_manager: string;

  @Column({ type: 'date', nullable: false })
  @ApiProperty({
    description:'start date of project'
})
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  @ApiProperty({
    description:'end date of project'
})
  end_date: Date;

  @Column({
    type: 'enum',
    enum: ['active','inactive'],
    default: 'inactive',
  })
  @ApiProperty({
    description:'status of project'
})
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description:'When employee was Created'
  })
  created_at: Date;


  @Column({ default: '' })
  @ApiProperty({
    description:'employee created by'
  })
  created_by: string;

  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description:'When employee was Updated'
  })
  updated_at: Date;

  @Column({ default: ''})
  @ApiProperty({
    description:'Employee Updated By'
  })
  updated_by: string;


  @Column({ type: 'timestamp', nullable:true })
  @ApiProperty({
    description:'The date at which employee deleted'
  })
  deleted_at: Date;

  @Column({ default: ''})
  @ApiProperty({
    description:'employee deleted by'
  })
  deleted_by: string;


  @Column({ type: 'json'})
  @ApiProperty({
    description:'array employees in project'
})
  team: { name: string; age:number}[];

//   @OneToMany(() => Assign, assign => assign.project)
//   assign: Assign[];


}