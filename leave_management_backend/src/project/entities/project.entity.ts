import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Employee, (employee) => employee.projects)
  @JoinColumn({name:'manager_id'})
    @ApiProperty({
        description:'prject manager',
        type:CreateEmployeeDto
    })
    manager: Employee

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive'; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: '' })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP'})
  updated_at: Date;

  @Column({ default: '' })
  updated_by: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ default: '' })
  deleted_by: string;




  @ApiProperty({
    description:'employees of project',
    type:CreateEmployeeDto
  })
  @ManyToMany(() => Employee)
    @JoinTable({name:'employee_project'})
    employee: Employee[]


}