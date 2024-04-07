import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employee/entities/Employee.entity';

@Entity('user_credentials')
export class UserCredentials {
  @PrimaryGeneratedColumn()
  e_id: number;

  // @OneToOne(() => Employee, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'emp_id' })
  // employee: Employee;


  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  
}