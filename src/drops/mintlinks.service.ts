import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mintlink } from './mintlink.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MintlinkService {
  constructor(
    @InjectRepository(Mintlink)
    private readonly mintlinksRepository: Repository<Mintlink>,
  ) {}

  async createMintlink(expiresAt: Date, remainingUses: number) {
    const mintlink = {
      expiresAt,
      remainingUses,
    };
    return await this.mintlinksRepository.save(mintlink);
  }
}

// missing delete mintlink
