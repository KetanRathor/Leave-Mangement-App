import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { LeaveType } from './LeaveType.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('leave_request')
export class LeaveRequest {
    @ApiProperty({
        description:"leave request id",
        example:2,
    })
    @PrimaryGeneratedColumn()
    leave_request_id: number;

    @ApiProperty({
        description:"The id of employee",
        example:1,
    })
    @Column({ nullable: false })
    emp_id: number;

    @ApiProperty({
        description:"The leave type id",
        example:2,
    })
    @Column({ nullable: false })
    leave_type_id: number;

    @ApiProperty({
        description:"start date of leave",
        example:"2024-04-12",
    })
    @Column({ type: 'date', nullable: false })
    start_date: Date;

    @ApiProperty({
        description:"The leave end date",
        example:"2024-04-13",
    })
    @Column({ type: 'date', nullable: false })
    end_date: Date;

    @ApiProperty({
        description:"The reason for the leave",
        example:"health issue",
    })
    @Column({ nullable: true })
    reason: string;

    @ApiProperty({
        description:"The status of the leave",
        example:"approved",
    })
    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default : 'pending'
    })
    status: string;

    @ApiProperty({
        description:"the date of leave application",
        example:"2024-04-04",
    })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty({
        description:"The date of leave update",
        example:"2024-04-05",
    })
    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // @Column({ type: 'varchar', default: 'Not Sent', nullable : true })
    // mail_status: string;

    @ManyToOne(() => LeaveType, (leaveType) => leaveType.leaveRequests)
    @JoinColumn({ name: 'leave_type_id' })
    leaveType: LeaveType;

    @ManyToOne(() => Employee, (employee) => employee.leaveRequests)
    @JoinColumn({ name: 'emp_id'})
    employee: Employee;
}   