import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drop } from './drop.entity';
import { MintlinksService } from './mintlinks.service';
import { UsersService } from '../users/users.service';
import { DropIdDto } from './dto/drop-id.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { Mintlink } from './mintlink.entity';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop) private readonly dropsRepository: Repository<Drop>,
    private readonly mintlinksService: MintlinksService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    title: string,
    description: string,
    image: string,
    startDate: Date,
    endDate: Date,
    totalAmount: number,
    creatorAddress: string,
  ): Promise<Mintlink> {
    const creator = await this.usersService.getOnePartialByAddress(
      creatorAddress,
    );
    const expiryDate = new Date(endDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const drop = this.dropsRepository.create({
      title,
      description,
      image,
      startDate,
      endDate,
      totalAmount,
      creator,
    });
    await this.dropsRepository.save(drop);
    return await this.mintlinksService.create(expiryDate, totalAmount, drop);
  }

  async getFullOneById(dropId: string): Promise<Drop> {
    const drop = await this.dropsRepository
      .createQueryBuilder('drop')
      .leftJoinAndSelect('drop.mintlinks', 'mintlink')
      .where('drop.id = :dropId', { dropId })
      .getOne();
    if (!drop) {
      throw new NotFoundException(`Drop with id ${dropId} not found.`);
    }
    return drop;
  }

  async updateDrop(
    dropIdDto: DropIdDto,
    updateDropDto: UpdateDropDto,
  ): Promise<Drop> {
    const { id } = dropIdDto;
    const drop = await this.getFullOneById(id);
    if (drop.totalAmount !== drop.mintlinks[0].remainingUses) {
      throw new ConflictException(
        `No puedes realizar esta acción una vez se ha minteado algún Soulmate`,
      );
    }
    const { title, description, image } = updateDropDto;
    if (title) {
      drop.title = title;
    }
    if (description) {
      drop.description = description;
    }
    if (image) {
      drop.image = image;
    }
    await this.dropsRepository.save(drop);
    return drop;
  }

  async deleteDropById(dropIdDto: DropIdDto): Promise<void> {
    const { id } = dropIdDto;
    const drop = await this.getFullOneById(id);
    await this.dropsRepository.delete(id);
    await this.mintlinksService.deleteMintlink(drop.mintlinks[0].id);
  }

  async deleteDropsByCreatorAddress(address: string): Promise<void> {
    const result = await this.dropsRepository
      .createQueryBuilder('drops')
      .delete()
      .from(Drop)
      .where('creatorAddress = :address', { address })
      .execute();
    // const drop = await this.getFullDropById(id);
    // await this.dropsRepository.delete(id);
    // await this.mintlinksService.deleteMintlink(drop.mintlink.id);
  }
}
