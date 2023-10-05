import { Drop } from '../drops/drop.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  address: string;

  @Column()
  nonce: string;

  @OneToMany(() => Drop, (drop) => drop.creator)
  drops: Drop[];
}
