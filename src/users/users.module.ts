import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Drop } from 'src/drops/drop.entity';
import { Mintlink } from 'src/drops/mintlink.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Drop, Mintlink])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
