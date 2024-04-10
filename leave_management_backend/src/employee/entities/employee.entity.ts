import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Department } from '../../department/entity/Department.entity';
import { LeaveRequest } from '../../leave_types_and_requests/entities/LeaveRequest.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
// import { ApiProperty } from '@nestjs/swagger';

@Entity('employee')
export class Employee {
  // @ApiProperty({
  //   description:'The id of Employee'
  // })
  @PrimaryGeneratedColumn()
  id: number;

  // @ApiProperty({
  //   description:'The id of Employee'
  // })
  @Column({ nullable: false })
  name: string;

  // @ApiProperty({
  //   description:'The email of Employee'
  // })
  @Column({ nullable: false, unique: true })
  email: string;

  // @ApiProperty({
  //   description:'The mobile number of Employee'
  // })
  @Column({ nullable: false })
  mobile_number: string;

  // @ApiProperty({
  //   description:'When user was Created'
  // })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @Column({ default: '' })
  created_by: string;

  // @ApiProperty({
  //   description:'When user was Updated'
  // })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ default: '' })
  updated_by: string;


  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;



  @Column({ default: '' })
  deleted_by: string;

  // @Column({ nullable: false })
  // @Column()
  // manager_id: number;
  // @ApiProperty({
  //   description:'The manager id of Employee'
  // })
  @Column({ default: null })
  manager_id: number | null;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'manager_id' })
  manager: Employee | null;

  // @Column({ nullable: false })
  @Column({ default: null })
  department_id: number | null;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({
    type: 'enum',
    enum: ['Employee', 'Manager', 'Admin'],
  })
  role: string;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  @JoinColumn({ name: 'leave_request_id' })
  leaveRequests: LeaveRequest[];

  // @OneToMany(() => Inventory, (inventory) => inventory.employee)
  // @JoinColumn({ name: 'invertory_id'})
  // inventories: Inventory[];

  @OneToMany(() => Inventory, (inventory) => inventory.employee, { cascade: true })
  inventories: Inventory[]
}