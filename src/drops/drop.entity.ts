import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mintlink } from './mintlink.entity';
import { User } from '../users/user.entity';

@Entity()
export class Drop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  startDate: number;

  @Column()
  endDate: number;

  @OneToOne(() => Mintlink)
  @JoinColumn()
  mintlink: Mintlink;

  @ManyToOne(() => User, (user) => user.drops)
  creator: User;
}
