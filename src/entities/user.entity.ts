import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 60 })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ default: false })
  @Exclude()
  isConfirmed: boolean;

  @Column()
  @Exclude()
  confirmToken: string;
}
