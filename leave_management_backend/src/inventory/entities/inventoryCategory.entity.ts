import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Inventory } from './inventory.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('categories')
export class Category {
  @ApiProperty({
    description:'Id of Category'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description:'Name ofCategory'
  })
  @Column()
  name: string;

  @ApiProperty({
    description:'The date on which Category created'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty({
      description:'Category created By'
    })
    @Column({ default: '' })
    created_by: string;

    @ApiProperty({
      description:'The date on which category updated'
    })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ApiProperty({
      description:'Category updatyed by'
    })
    @Column({ default: '' })
    updated_by: string;

    @ApiProperty({
      description:'the date on which category deleted '
    })
    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @ApiProperty({
      description:'Category deleted by'
    })
    @Column({ default: '' })
    deleted_by: string;

    @ApiProperty({
      description:'Inventories',
      type:()=>Inventory
    })
  @OneToMany(() => Inventory, (inventory) => inventory.category)
  // @JoinColumn({ name: 'category_id' })
  inventories: Inventory[];
}
