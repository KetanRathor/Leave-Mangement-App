import { timestamp } from 'rxjs';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('holiday')
export class Holidays {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  ocacsion: string;

  @Column({ nullable: false })
  day: string;
  
  @Column({type:'timestamp'})
  date: Date
  
  @Column({type:'blob'})
  image: URL
}
