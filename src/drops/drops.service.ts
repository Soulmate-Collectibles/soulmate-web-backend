import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Drop } from './drop.entity';
import { Repository } from 'typeorm';
import { CreateDropDto } from './dto/create-drop.dto';
import { MintlinkService } from './mintlinks.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop) private readonly dropsRepository: Repository<Drop>,
    private readonly mintlinksService: MintlinkService,
    private readonly usersService: UsersService,
  ) {}

  async createDrop(createDropDto: CreateDropDto) {
    const { endDate, totalAmount, creatorAddress } = createDropDto;
    const creator = await this.usersService.getPartialUserByAddress(
      creatorAddress,
    );
    delete createDropDto.creatorAddress;
    const expiryDate = new Date(endDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const mintlink = await this.mintlinksService.createMintlink(
      expiryDate,
      totalAmount,
    );
    const drop = this.dropsRepository.create({
      ...createDropDto,
      mintlink,
      creator,
    });
    return await this.dropsRepository.save(drop);
  }
}
