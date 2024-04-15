import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../../employee/entities/Employee.entity';
import { ApiProperty } from '@nestjs/swagger';
import { timeStamp } from 'console';

@Entity('department')
export class Department {
  @ApiProperty({
    description: 'The department id ',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The department name ',
  })
  @Column({ nullable: false })
  department_name: string;

  @ApiProperty({
    description: 'the date on which department created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'department created by',
  })
  @Column({ default: '' })
  created_by: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  // updated_at: Date;

  // @Column({ default: ''})
  // updated_by: string;

  @ApiProperty({
    description: 'The date on which department deleted',
  })
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ApiProperty({
    description: 'department deleted by',
  })
  @Column({ default: '' })
  deleted_by: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

  // @Column({ type: 'timestamp', nullable: true })
  // deleted_at: Date;

  // @Column({ default: 'system' })
  // deleted_by: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // created_at: Date;

  // @Column({ default: 'system' })
  // created_by: string;
}
