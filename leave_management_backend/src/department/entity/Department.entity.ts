import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../../employee/entities/Employee.entity';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn()
  department_id: number;

  @Column({ nullable: false })
  department_name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
