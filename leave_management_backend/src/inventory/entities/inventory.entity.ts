import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { Employee } from 'src/employee/entities/Employee.entity';
import { Category } from './inventoryCategory.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CreateInvetoryCategoryDto } from '../dto/create-inventoryCategory.dto';


@Entity('inventories')
export class Inventory {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description:'Id of the Inventory'
    })
    id: number;

    @Column()
    @ApiProperty({
        description:'Name of the Inventory'
    })
    name: string;

    @Column({ nullable: true })
    @ApiProperty({
        description:'serial Number of the Inventory'
    })
    serial_number: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({
        description:'The date time at which inventory created'
    })
    created_at: Date;

    @Column({ default: '' })
    @ApiProperty({
        description:'Inventory created by'
    })
    created_by: string;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @ApiProperty({
        description:'The date time at which inventory updated'
    })
    updated_at: Date;

    @Column({ default: '' })
    @ApiProperty({
        description:'Inventory updated by'
    })
    updated_by: string;

    @Column({ type: 'timestamp', nullable: true })
    @ApiProperty({
        description:'The date time at which inventory deleted'
    })
    deleted_at: Date;

    @Column({ default: '' })
    @ApiProperty({
        description:'Inventory deleted by'
    })
    deleted_by: string;

    //   @ManyToOne(() => Employee)
    //   @JoinColumn({ name: 'emp_id'})
    // //   @Column({ nullable: true, default: null })
    //   employee: Employee;

    @ManyToOne(() => Employee, (employee) => employee.inventories)
    @ApiProperty({
        description:'Employee who have inventory',
        type:CreateEmployeeDto
    })
    employee: Employee

    @ManyToOne(() => Category, (category) => category.inventories)
    @ApiProperty({
        description:'category of the inventory',
        type:CreateInvetoryCategoryDto
    })
    // @JoinColumn({ name: 'category_id' })
    category: Category;
}