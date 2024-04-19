import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { ApiProperty } from '@nestjs/swagger';
// import { LeaveType } from './LeaveType.entity';

@Entity('leave_request')
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The id of leave request',
  })
  id: number;

  @Column({ nullable: false, default: 0 })
  @ApiProperty({
    description: 'the id of employee',
  })
  emp_id: number;

  @Column({
    type: 'enum',
    enum: ['first half', 'second half', 'full', 'work from home'],
  })
  @ApiProperty({
    description: 'the type of leave',
  })
  leave_type: string;

  @Column({ type: 'date', nullable: false })
  @ApiProperty({
    description: 'start date for leave',
  })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  @ApiProperty({
    description: 'end date for leave',
  })
  end_date: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'reason for the leave',
  })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  @ApiProperty({
    description: 'status of leave request',
  })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date at which leave request created',
  })
  created_at: Date;

  @Column({ default: '' })
  @ApiProperty({
    description: 'leave request created by ',
  })
  created_by: string;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'The date at which leave request updated',
  })
  updated_at: Date;

  @Column({ default: '' })
  @ApiProperty({
    description: 'The leave request updated by',
  })
  updated_by: string;

  // @Column({ type: 'varchar', default: 'Not Sent', nullable: true })
  // mail_status: string;

  // @ManyToOne(() => LeaveType, (leaveType) => leaveType.leaveRequests)
  // @JoinColumn({ name: 'leave_type_id' })
  // leaveType: LeaveType;

  @ManyToOne(() => Employee, (employee) => employee.leaveRequests)
  @JoinColumn({ name: 'emp_id' })
  employee: Employee;
}
