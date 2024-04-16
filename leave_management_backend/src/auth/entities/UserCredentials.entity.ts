import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_credentials')
export class UserCredentials {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => Employee, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'emp_id' })
  // employee: Employee;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // created_at: Date;

  // @Column({ default: '' })
  // created_by: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updated_at: Date;

  // @Column({ default: '' })
  // updated_by: string;

  // @Column({ type: 'timestamp',nullable:true })
  // deleted_at: Date;

  // @Column({ default: '' })
  // deleted_by: string;
}
