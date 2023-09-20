import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mintlink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  remainingUses: number;
}
