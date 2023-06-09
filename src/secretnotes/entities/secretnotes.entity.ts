import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SecretNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  note: string;
  @Column('text')
  privateKey?: string;
  @CreateDateColumn({ name: 'created_at' })
  created_at?: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: Date;
}
