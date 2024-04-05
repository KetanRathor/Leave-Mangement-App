import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { LeaveRequest } from './LeaveRequest.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('leave_type')
export class LeaveType {
  @ApiProperty({
    description:"leave type id",
    example:2,
})
  @PrimaryGeneratedColumn()
  leave_type_id: number;

  @ApiProperty({
    description:"leave type name",
    example:"half day",
})
  @Column({ nullable: false })
  leave_type_name: string;

  @ApiProperty({
    description:"default balance",
    example:20,
})
  @Column({ type: 'int', nullable: false })
  default_balance: number;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.leaveType)
  @JoinColumn({ name: 'leave_type_id' })
  leaveRequests: LeaveRequest[];
}