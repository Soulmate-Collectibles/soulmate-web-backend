import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metadata } from './metadata.interface';
import { Mintlink } from './mintlink.entity';
import { Drop } from '../../drops/drop.entity';
import { IpfsService } from '../../ipfs/ipfs.service';
import { ContractService } from '../contract/contract.service';

@Injectable()
export class MintlinksService {
  constructor(
    @InjectRepository(Mintlink)
    private readonly mintlinksRepository: Repository<Mintlink>,
    private readonly ipfsService: IpfsService,
    private readonly contractService: ContractService,
  ) {}

  create(expiresAt: Date, remainingUses: number): Mintlink {
    return this.mintlinksRepository.create({
      expiresAt,
      remainingUses,
    });
  }

  async getOnePartial(id: string): Promise<Mintlink> {
    const mintlink = await this.mintlinksRepository
      .createQueryBuilder('mintlink')
      .where('mintlink.id = :id', { id })
      .getOne();
    if (!mintlink) {
      throw new NotFoundException(`Mintlink with id ${id} not found`);
    }
    return mintlink;
  }

  async getOneFull(id: string, creatorAddress?: string): Promise<Mintlink> {
    let mintlink: Mintlink;
    if (creatorAddress) {
      mintlink = await this.mintlinksRepository
        .createQueryBuilder('mintlink')
        .leftJoinAndSelect('mintlink.drop', 'drop')
        .leftJoinAndSelect('drop.creator', 'creator')
        .where('mintlink.id = :id', { id })
        .andWhere('drop.creatorAddress = :creatorAddress', {
          creatorAddress,
        })
        .getOne();
    } else {
      mintlink = await this.mintlinksRepository
        .createQueryBuilder('mintlink')
        .leftJoinAndSelect('mintlink.drop', 'drop')
        .leftJoinAndSelect('drop.creator', 'creator')
        .where('mintlink.id = :id', { id })
        .getOne();
    }
    if (!mintlink) {
      throw new NotFoundException(`Mintlink not found`);
    }
    return mintlink;
  }

  async update(id: string, remainingUses: number): Promise<void> {
    const mintlink = await this.getOnePartial(id);
    if (remainingUses >= mintlink.remainingUses) {
      throw new ConflictException(
        `Must decrease number of remaining uses. Current value is ${mintlink.remainingUses}`,
      );
    }
    mintlink.remainingUses = remainingUses;
    await this.mintlinksRepository.save(mintlink);
    return;
  }

  async mint(mintlinkId: string, receiverAddress: string) {
    const mintlink = await this.getOneFull(mintlinkId);
    this.dropConfirmedValidation(mintlink.drop);
    this.mintlinkRemainingValidation(mintlink);
    const metadata = this.generateMetadata(mintlink);
    const tokenURI = await this.ipfsService.pinJSONToIpfs(metadata);
    const txHash = await this.contractService.safeMint(
      receiverAddress,
      tokenURI,
    );
    return {
      txHash,
      tokenURI,
    };
  }

  generateMetadata(fullMintlink: Mintlink): Metadata {
    const {
      id: dropID,
      title: name,
      description,
      image,
      startDate,
      endDate,
      totalAmount: total_issuance,
    } = fullMintlink.drop;
    const { address: creator } = fullMintlink.drop.creator;
    const { remainingUses: token_in_drop_serial } = fullMintlink;

    return {
      collection: 'Soulmate',
      name,
      description,
      image,
      start_date: startDate.getTime(),
      end_date: endDate.getTime(),
      dropID,
      token_in_drop_serial,
      total_issuance,
      creator,
    };
  }

  dropConfirmedValidation(partialDrop: Drop): void {
    if (!partialDrop.confirmed) {
      throw new ConflictException(
        `Can not perform the operation because drop has not been confirmed`,
      );
    }
    return;
  }

  mintlinkRemainingValidation(partialMintlink: Mintlink) {
    if (partialMintlink.remainingUses <= 0) {
      throw new ConflictException(`No remaining uses`);
    }
  }
}
