import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { Category } from './inventoryCategory.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CreateInvetoryCategoryDto } from '../dto/create-inventoryCategory.dto';

@Entity('inventories')
export class Inventory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Id of the Inventory',
  })
  id: number;

  @ApiProperty()
  @Column()
  name: string;
  @Column()
  @ApiProperty({
    description: 'Name of the Inventory',
  })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  serial_number: string;
  @Column({ nullable: true })
  @ApiProperty({
    description: 'serial Number of the Inventory',
  })
  serial_number: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'The date time at which inventory created',
  })
  created_at: Date;

  @ApiProperty()
  @Column({ default: '' })
  created_by: string;
  @Column({ default: '' })
  @ApiProperty({
    description: 'Inventory created by',
  })
  created_by: string;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty()
  @Column({ default: '' })
  updated_by: string;
  @Column({ default: '' })
  @ApiProperty({
    description: 'Inventory updated by',
  })
  updated_by: string;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    description: 'The date time at which inventory deleted',
  })
  deleted_at: Date;

  @ApiProperty()
  @Column({ default: '' })
  deleted_by: string;
  @Column({ default: '' })
  @ApiProperty({
    description: 'Inventory deleted by',
  })
  deleted_by: string;

  //   @ManyToOne(() => Employee)
  //   @JoinColumn({ name: 'emp_id'})
  // //   @Column({ nullable: true, default: null })
  //   employee: Employee;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.inventories)
  employee: Employee;
  @ManyToOne(() => Employee, (employee) => employee.inventories)
  @ApiProperty({
    description: 'Employee who have inventory',
    type: CreateEmployeeDto,
  })
  employee: Employee;

  @ManyToOne(() => Category, (category) => category.inventories)
  // @JoinColumn({ name: 'category_id' })
  category: Category;
  @ManyToOne(() => Category, (category) => category.inventories)
  @ApiProperty({
    description: 'category of the inventory',
    type: CreateInvetoryCategoryDto,
  })
  // @JoinColumn({ name: 'category_id' })
  category: Category;
}
