import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drop } from './drop.entity';
import { MintlinksService } from '../mintlinks/mintlinks.service';
import { UsersService } from '../auth/users/users.service';
import { IpfsService } from '../ipfs/ipfs.service';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop) private readonly dropsRepository: Repository<Drop>,
    private readonly mintlinksService: MintlinksService,
    private readonly usersService: UsersService,
    private readonly ipfsService: IpfsService,
  ) {}

  async create(
    creatorAddress: string,
    title: string,
    description: string,
    image: Buffer,
    startDate: Date,
    endDate: Date,
    totalAmount: number,
  ): Promise<Drop> {
    const imageUrl = await this.ipfsService.pinBufferToIpfs(image);
    const creator = await this.usersService.getOnePartial(creatorAddress);
    const expiryDate = this.dateSumMonth(endDate);
    const mintlink = this.mintlinksService.create(expiryDate, totalAmount);
    const drop = this.dropsRepository.create({
      title,
      description,
      image: imageUrl,
      startDate,
      endDate,
      totalAmount,
      confirmed: false,
      creator,
      mintlinks: [mintlink],
    });
    return await this.dropsRepository.save(drop);
  }

  async getOneFull(dropId: string, creatorAddress: string): Promise<Drop> {
    const drop = await this.dropsRepository
      .createQueryBuilder('drop')
      .leftJoinAndSelect('drop.mintlinks', 'mintlink')
      .where('drop.id = :dropId', { dropId })
      .andWhere('drop.creatorAddress = :creatorAddress', { creatorAddress })
      .getOne();
    if (!drop) {
      throw new NotFoundException(`Drop not found`);
    }
    return drop;
  }

  async getOnePartial(dropId: string, creatorAddress: string): Promise<Drop> {
    const drop = await this.dropsRepository
      .createQueryBuilder('drop')
      .where('drop.id = :dropId', { dropId })
      .andWhere('drop.creatorAddress = :creatorAddress', { creatorAddress })
      .getOne();
    if (!drop) {
      throw new NotFoundException(`Drop not found`);
    }
    return drop;
  }

  async update(
    dropId: string,
    creatorAddress: string,
    title: string | undefined,
    description: string | undefined,
    image: Buffer | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
    totalAmount: number | undefined,
    confirmed: boolean | undefined,
  ): Promise<void> {
    const drop = await this.getOneFull(dropId, creatorAddress);

    this.notMintedValidation(drop);
    this.notConfirmedValidation(drop);

    title ? (drop.title = title) : null;

    description ? (drop.description = description) : null;

    image ? (drop.image = await this.ipfsService.pinBufferToIpfs(image)) : null;

    startDate ? (drop.startDate = startDate) : null;

    endDate ? (drop.endDate = endDate) : null;

    if (totalAmount) {
      drop.totalAmount = totalAmount;
      drop.mintlinks[0].remainingUses = totalAmount;
    }
    if (confirmed !== undefined) {
      if (confirmed === false) {
        throw new ConflictException('A drop can not be unconfirmed');
      }
      drop.confirmed = confirmed;
    }
    await this.dropsRepository.save(drop);
    return;
  }

  async delete(dropId: string, requestUserAddress: string): Promise<void> {
    const { affected: affectedRows } = await this.dropsRepository
      .createQueryBuilder()
      .delete()
      .from(Drop)
      .where('id = :dropId', { dropId })
      .andWhere('creatorAddress = :creatorAddress', {
        creatorAddress: requestUserAddress,
      })
      .execute();
    if (affectedRows === 0) {
      throw new NotFoundException(`Drop not found`);
    }
    return;
  }

  notMintedValidation(fullDrop: Drop): void {
    if (fullDrop.totalAmount !== fullDrop.mintlinks[0].remainingUses) {
      throw new ConflictException(
        `Can not perform the operation because drop has already been minted`,
      );
    }
    return;
  }

  notConfirmedValidation(partialDrop: Drop): void {
    if (partialDrop.confirmed) {
      throw new ConflictException(
        `Can not perform the operation because drop has already been confirmed`,
      );
    }
    return;
  }

  dateSumMonth(baseDate: Date): Date {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
  }
}
