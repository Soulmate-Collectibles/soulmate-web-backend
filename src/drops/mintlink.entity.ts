import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Drop } from './drop.entity';

@Entity()
export class Mintlink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expiresAt: Date;

  @Column()
  remainingUses: number;

  @ManyToOne(() => Drop, (drop) => drop.mintlinks, { onDelete: 'CASCADE' })
  drop: Drop;
}
