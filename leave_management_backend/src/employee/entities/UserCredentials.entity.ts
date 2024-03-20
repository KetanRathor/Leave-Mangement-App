import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employee.entity';

@Entity('user_credentials')
export class UserCredentials {
  @PrimaryGeneratedColumn()
  e_id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;
}
