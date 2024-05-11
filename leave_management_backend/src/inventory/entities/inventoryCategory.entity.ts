import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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


  @OneToMany(() => Inventory, (inventory) => inventory.category)
  // @JoinColumn({ name: 'category_id' })
  inventories: Inventory[];
}
