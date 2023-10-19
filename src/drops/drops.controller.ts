import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { DropIdDto } from './dto/drop-id.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { GetUser } from '../auth/auth/get-user.decorator';
import { User } from '../auth/users/user.entity';
import { IpfsService } from '../ipfs/ipfs.service';

@Controller('drops')
@UseGuards(AuthGuard())
export class DropsController {
  constructor(
    private readonly dropsService: DropsService,
    private readonly ipfsService: IpfsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createDropDto: CreateDropDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 4194304 }),
          new FileTypeValidator({ fileType: /image\/png|image\/gif/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const { title, description, startDate, endDate, totalAmount } =
      createDropDto;
    const { address } = user;
    const { buffer } = image;
    const imageUrl = await this.ipfsService.pinBufferToIpfs(buffer);
    return await this.dropsService.create(
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      totalAmount,
      address,
    );
  }

  // @Patch('/:id')
  // update(
  //   @Param() dropIdDto: DropIdDto,
  //   @Body() updateDropDto: UpdateDropDto,
  //   @GetUser() user: User,
  // ): Promise<void> {
  //   const { id } = dropIdDto;
  //   const { title, description, image } = updateDropDto;
  //   const { address } = user;
  //   return this.dropsService.update(id, title, description, image, address);
  // }

  @Delete('/:id')
  delete(@Param() dropIdDto: DropIdDto, @GetUser() user: User): Promise<void> {
    const { id } = dropIdDto;
    const { address } = user;
    return this.dropsService.delete(id, address);
  }
}
