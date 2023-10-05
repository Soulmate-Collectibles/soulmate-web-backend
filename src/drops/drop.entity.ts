import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
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

  @OneToOne(() => Mintlink)
  @JoinColumn()
  mintlink: Mintlink;

  @ManyToOne(() => User, (user) => user.drops, { onDelete: 'CASCADE' })
  creator: User;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted drop with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated drop with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed drop with id ${this.id}`);
  }
}
