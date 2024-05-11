import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('holidays')
export class Holidays {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'id ',
    example: '1',
  })
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'occasion date',
    example: '2024-01-01',
  })
  date: Date;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'occasion day',
    example: 'monday',
  })
  day: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'occasion name',
    example: 'New Year',
  })
  occasion: string;

  @Column('longblob', { nullable: true })
  @ApiProperty({
    description: 'occasion image',
  })
  image: Buffer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description:'When holiday was Created'
  })
  created_at: Date;


  @Column({ default: '' })
  @ApiProperty({
    description:'Holiday created by'
  })
  created_by: string;
}
