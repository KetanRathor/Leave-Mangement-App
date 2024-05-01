import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employee/entities/Employee.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_credentials')
export class UserCredentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  

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

  @OneToOne(() => Employee, (employee) => employee.userCredentials, { nullable: true, cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee | null;


  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // created_at: Date;

  // @Column({ default: '' })
  // created_by: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updated_at: Date;

  // @Column({ default: '' })
  // updated_by: string;

  // @Column({ type: 'timestamp',nullable:true })
  // deleted_at: Date;

  // @Column({ default: '' })
  // deleted_by: string;
}
