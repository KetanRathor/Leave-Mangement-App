import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Department } from '../../department/entity/Department.entity';
import { LeaveRequest } from '../../leave_types_and_requests/entities/LeaveRequest.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Project } from 'src/project/entities/project.entity';

@Entity('employee')
export class Employee {
  
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description:'The id of Employee'
  })
  id: number;

  
  @Column({ nullable: false })
  @ApiProperty({
    description:'The name of Employee'
  })
  name: string;

  
  @Column({ nullable: false, unique: true })
  @ApiProperty({
    description:'The email of Employee'
  })
  email: string;

  
  @Column({ nullable: false })
  @ApiProperty({
    description:'The mobile number of Employee'
  })
  mobile_number: string;

  @Column({ type:'timestamp'})
  @ApiProperty({
    description:'The date of birth of Employee'
  })
  dob: Date;

  // @Column({ nullable: false })
  // @ApiProperty({
  //   description:'The gender of Employee'
  // })
  // gender: string;
  // @Column({
  //   type: 'enum',
  //   enum: ['Male', 'Female', 'Other'],
  //   default: 'Male',
  // })
  // gender: string;

  @Column({
    type: 'enum',
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  })
  @ApiProperty({
    description:'The gender of Employee'
  })
  gender: string;
  
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

  // @Column({ nullable: false })
  // @Column()
  // manager_id: number;
  
  @Column({ default: null })
  @ApiProperty({
    description:'The manager id of Employee'
  })
  manager_id: number | null;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'manager_id' })
  manager: Employee | null;

  // @Column({ nullable: false })
  @Column({ default: null })
  @ApiProperty({
    description:'The department id of Employee'
  })
  department_id: number | null;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({
    type: 'enum',
    enum: ['Employee', 'Manager', 'Admin'],
  })
  @ApiProperty({
    description:'The role of employee'
  })
  role: string;

  @Column('longblob', { nullable: true })
  @ApiProperty({
    description:'occasion image'
  })
  image: Buffer;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  @JoinColumn({ name: 'leave_request_id'})
  leaveRequests: LeaveRequest[];

  @OneToMany(() => Inventory, (inventory) => inventory.employee, { cascade: true })
  inventories: Inventory[]

  @ManyToMany(() => Project)
    @JoinTable({name:"employee_project"})
    project: Project[]
  
}