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

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ default: 'system' })
  deleted_by: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: 'system' })
  created_by: string;

}
