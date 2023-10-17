import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Drop } from '../../drops/drop.entity';

@Entity()
export class User {
  @PrimaryColumn()
  address: string;

  @Column()
  nonce: string;

  @OneToMany(() => Drop, (drop) => drop.creator)
  drops: Drop[];
}
