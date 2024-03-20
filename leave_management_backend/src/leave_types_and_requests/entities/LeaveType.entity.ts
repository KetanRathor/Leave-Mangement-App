import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { LeaveRequest } from './LeaveRequest.entity';

@Entity('leave_type')
export class LeaveType {
  @PrimaryGeneratedColumn()
  leave_type_id: number;

  @Column({ nullable: false })
  leave_type_name: string;

  @Column({ type: 'int', nullable: false })
  default_balance: number;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.leaveType)
  @JoinColumn({ name: 'leave_type_id' })
  leaveRequests: LeaveRequest[];
}
