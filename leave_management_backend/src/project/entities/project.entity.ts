import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { forwardRef } from '@nestjs/common';
@Entity('projects')
export class Project {
  @ApiProperty({
    description:'Id of project'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description:'Name of project'
  })
  @Column()
  name: string;

  @ManyToOne(() => Employee, (employee) => employee.projects,{ eager: false })
  @JoinColumn({name:'manager_id'})
    @ApiProperty({
        description:'project manager',
        type:CreateEmployeeDto
    })
    manager: Employee | null;

  @ApiProperty({
    description:'description of project'
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description:'start date of project'
  })
  @Column({ nullable: true })
  start_date?: Date;

  @ApiProperty({
    description:'end date of project'
  })
  @Column({ nullable: true })
  end_date?: Date;

  @ApiProperty({
    description:'status of project'
  })
  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive'; 

  @ApiProperty({
    description:'date on which project created'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description:'project created by'
  })
  @Column({ default: '' })
  created_by: string;

  @ApiProperty({
    description:'the date on which project updated'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty({
    description:'project updated by'
  })
  @Column({ default: '' })
  updated_by: string;

  @ApiProperty({
    description:'the date on which project deleted'
  })
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ApiProperty({
    description:'project deleted by'
  })
  @Column({ default: '' })
  deleted_by: string;

  // @ApiProperty({
  //   description: 'Employee assigned to this project (one-to-one)',
  // })
  // @ManyToOne(() => forwardRef(() => Employee), (employee) => employee.projects)
  // employees: Employee;



  @ApiProperty({
    description:'employees of project',
    type:CreateEmployeeDto
  })
  @ManyToMany(() => Employee, { cascade: true })
    @JoinTable({name:'employee_project'})
    employee: Employee[]

    @OneToMany(() => Employee, (employee) => employee.manager) 
  projects: Employee[];

  

}