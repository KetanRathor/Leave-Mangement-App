import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../../employee/entities/Employee.entity';
// import { ApiProperty } from '@nestjs/swagger';

@Entity('department')
export class Department {
  // @ApiProperty({
  //   description:'The department id '
  // })
  @PrimaryGeneratedColumn()
  id: number;

  // @ApiProperty({
  //   description:'The department name '
  // })
  @Column({ nullable: false })
  department_name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
