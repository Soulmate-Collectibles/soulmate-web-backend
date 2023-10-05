import { Drop } from '../drops/drop.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  address: string;

  @Column()
  nonce: string;

  @OneToMany(() => Drop, (drop) => drop.creator)
  drops: Drop[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with address ${this.address}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with address ${this.address}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed user with address ${this.address}`);
  }
}
