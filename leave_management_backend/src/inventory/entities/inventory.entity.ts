import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { Category } from './inventoryCategory.entity';


@Entity('inventories')
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    serial_number: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ default: '' })
    created_by: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ default: '' })
    updated_by: string;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @Column({ default: '' })
    deleted_by: string;

    //   @ManyToOne(() => Employee)
    //   @JoinColumn({ name: 'emp_id'})
    // //   @Column({ nullable: true, default: null })
    //   employee: Employee;

    @ManyToOne(() => Employee, (employee) => employee.inventories)
    employee: Employee

    @ManyToOne(() => Category, (category) => category.inventories)
    // @JoinColumn({ name: 'category_id' })
    category: Category;
}