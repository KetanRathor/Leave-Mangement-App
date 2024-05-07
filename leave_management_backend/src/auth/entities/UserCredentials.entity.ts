import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employee/entities/Employee.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_credentials')
export class UserCredentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  // @Column({ nullable: false })
  // password: string;

  @Column()
  displayName: string;

  // @Column({ type: 'timestamp', nullable:true })
  // @ApiProperty({
  //   description:'The date at which employee deleted'
  // })
  // deleted_at: Date;

  // @Column({ default: ''})
  // @ApiProperty({
  //   description:'employee deleted by'
  // })
  // deleted_by: string;

}