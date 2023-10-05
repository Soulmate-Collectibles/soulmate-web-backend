import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Mintlink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expiresAt: Date;

  @Column()
  remainingUses: number;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted mintlink with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated mintlink with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed mintlink with id ${this.id}`);
  }
}
