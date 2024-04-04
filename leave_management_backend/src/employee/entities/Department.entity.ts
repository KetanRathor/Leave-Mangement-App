import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from './Employee.entity';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  department_name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

  @Column({ nullable: false })
  deleted_at: string;

  @Column({ nullable: false })
  deleted_by: string;

}
