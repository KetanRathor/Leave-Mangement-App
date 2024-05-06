import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/employee/entities/Employee.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';


@Entity('userotp')
export class UserOtp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 6 })
  otpCode: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: false })
  expiresAt: Date;

  // @OneToOne(() => Employee,(employee) => employee.userOtp,)
  // @JoinColumn({ name:"employeeId" })
  // employee: Employee;


  @OneToOne(() => Employee, (employee) => employee.userOtp)
  @JoinColumn({ name: 'employeeId'})
  employeeId: Employee;

  
}
