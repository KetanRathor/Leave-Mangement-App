import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
@Entity('projects')
export class Project {
  @ApiProperty({
    description: 'Id of project',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of project',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'manager_name of project',
  })
  @Column()
  manager_name: string;
  @ManyToOne(() => Employee, (employee) => employee.projects)
  // @JoinTable({name:'manager_id'})
  @ApiProperty({
    description: 'prject manager',
    type: CreateEmployeeDto,
  })
  manager: Employee;

  @ApiProperty({
    description: 'description of project',
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'start date of project',
  })
  @Column({ nullable: true })
  startDate?: Date;

  @ApiProperty({
    description: 'end date of project',
  })
  @Column({ nullable: true })
  endDate?: Date;

  @ApiProperty({
    description: 'status of project',
  })
  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @ApiProperty({
    description: 'date on which project created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'project created by',
  })
  @Column({ default: '' })
  created_by: string;

  @ApiProperty({
    description: 'the date on which project updated',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'project updated by',
  })
  @Column({ default: '' })
  updated_by: string;

  @ApiProperty({
    description: 'the date on which project deleted',
  })
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ApiProperty({
    description: 'project deleted by',
  })
  @Column({ default: '' })
  deleted_by: string;

  @ApiProperty({
    description: 'employees of project',
    type: CreateEmployeeDto,
  })
  @ManyToMany(() => Employee)
  @JoinTable({ name: 'employee_project' })
  employee: Employee[];
}
