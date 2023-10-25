import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mintlink } from '../mintlinks/mintlink.entity';
import { User } from '../auth/users/user.entity';

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

  @Column()
  confirmed: boolean;

  @ManyToOne(() => User, (user) => user.drops, { onDelete: 'CASCADE' })
  creator: User;

  @OneToMany(() => Mintlink, (mintlink) => mintlink.drop, { cascade: true })
  mintlinks: Mintlink[];
}
