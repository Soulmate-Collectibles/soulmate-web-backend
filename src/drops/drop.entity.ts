import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mintlink } from './mintlink.entity';
import { User } from '../users/user.entity';

@Entity()
export class Drop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 300 })
  description: string;

  @Column()
  image: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.drops, { onDelete: 'CASCADE' })
  creator: User;

  @OneToMany(() => Mintlink, (mintlink) => mintlink.drop)
  mintlinks: Mintlink[];
}
