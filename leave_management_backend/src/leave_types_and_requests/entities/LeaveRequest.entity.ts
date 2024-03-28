// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// // import { Employee } from '../../employee/entities/employee.entity'
// import { Employee } from 'src/employee/entities/Employee.entity';
// import { LeaveType } from './LeaveType.entity';

// @Entity('leave_request')
// export class LeaveRequest {
//     @PrimaryGeneratedColumn()
//     leave_request_id: number;

//     // @Column({ nullable: false })
//     // emp_id: number;

//     @ManyToOne(() => Employee, (employee) => employee.leaveRequests)
//     @JoinColumn({ name: 'emp_id' })
//     employee: Employee;

//     @Column({ nullable: false })
//     leave_type_id: number;

//     @ManyToOne(() => LeaveType, (leaveType) => leaveType.leaveRequests)
//     @JoinColumn({ name: 'leave_type_id' })
//     leaveType: LeaveType;

//     @Column({ type: 'date', nullable: false })
//     start_date: Date;

//     @Column({ type: 'date', nullable: false })
//     end_date: Date;

//     @Column({ nullable: true })
//     reason: string;


//     @Column({
//         type: 'enum',
//         enum: ['approved', 'pending', 'rejected'],
//         default:'pending'
//     })
//     status: string;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     created_at: Date;

//     @Column({default: () => 'CURRENT_TIMESTAMP',  type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
//     updated_at: Date;

//     @Column({ type: 'varchar', default: 'Not Sent' })
//     mail_status: string
// }

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { LeaveType } from './LeaveType.entity';

@Entity('leave_request')
export class LeaveRequest {
    @PrimaryGeneratedColumn()
    leave_request_id: number;

    // @Column({ nullable: false })
    // emp_id: number;

    @Column({ nullable: false })
    leave_type_id: number;

    @Column({ type: 'date', nullable: false })
    start_date: Date;

    @Column({ type: 'date', nullable: false })
    end_date: Date;

    @Column({ nullable: true })
    reason: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default : 'pending'
    })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ type: 'varchar', default: 'Not Sent', nullable : true })
    mail_status: string;

    @ManyToOne(() => LeaveType, (leaveType) => leaveType.leaveRequests)
    @JoinColumn({ name: 'leave_type_id' })
    leaveType: LeaveType;

    @ManyToOne(() => Employee, (employee) => employee.leaveRequests)
    @JoinColumn({ name: 'emp_id'})
    employee: Employee;
}   