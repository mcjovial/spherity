import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class SecretNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  note: string;
}
