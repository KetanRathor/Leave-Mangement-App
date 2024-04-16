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

@Entity('inventories')
export class Inventory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  serial_number: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty()
  @Column({ default: '' })
  created_by: string;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ApiProperty()
  @Column({ default: '' })
  updated_by: string;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ApiProperty()
  @Column({ default: '' })
  deleted_by: string;

  //   @ManyToOne(() => Employee)
  //   @JoinColumn({ name: 'emp_id'})
  // //   @Column({ nullable: true, default: null })
  //   employee: Employee;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.inventories)
  employee: Employee;

  @ManyToOne(() => Category, (category) => category.inventories)
  // @JoinColumn({ name: 'category_id' })
  category: Category;
}
