import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Drop } from './drop.entity';
import { Repository } from 'typeorm';
import { CreateDropDto } from './dto/create-drop.dto';
import { MintlinkService } from './mintlinks.service';
import { UsersService } from '../users/users.service';
import { DropIdDto } from './dto/drop-id.dto';
import { UpdateDropDto } from './dto/update-drop.dto';

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

  async getFullDropById(dropId: string): Promise<Drop> {
    const found = await this.dropsRepository.findOne({
      where: {
        id: dropId,
      },
      relations: {
        mintlink: true,
      },
    });
    if (!found) {
      throw new NotFoundException(`Drop with id ${dropId} not found.`);
    }
    return found;
  }

  async updateDrop(
    dropIdDto: DropIdDto,
    updateDropDto: UpdateDropDto,
  ): Promise<Drop> {
    const { id } = dropIdDto;
    const drop = await this.getFullDropById(id);
    if (drop.totalAmount !== drop.mintlink.remainingUses) {
      throw new ConflictException();
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

  async deleteDrop(dropIdDto: DropIdDto): Promise<void> {
    const { affected: rowsAffected } = await this.dropsRepository.delete(
      dropIdDto,
    );
    if (rowsAffected === 0) {
      throw new NotFoundException(
        `Drop with address ${dropIdDto.id} not found.`,
      );
    }
  }
}
