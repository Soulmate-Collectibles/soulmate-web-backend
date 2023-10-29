import {
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipeBuilder,
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
import { Drop } from './drop.entity';

@Controller('drops')
@UseGuards(AuthGuard())
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createDropDto: CreateDropDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/png|image\/gif/,
        })
        .addMaxSizeValidator({
          maxSize: 4194304,
        })
        .build(),
    )
    image: Express.Multer.File,
  ): Promise<Drop> {
    const { title, description, startDate, endDate, totalAmount } =
      createDropDto;
    const { address: requestUserAddress } = user;
    const { buffer: imageBuffer } = image;
    return await this.dropsService.create(
      requestUserAddress,
      title,
      description,
      imageBuffer,
      startDate,
      endDate,
      totalAmount,
    );
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param() dropIdDto: DropIdDto,
    @Body() updateDropDto: UpdateDropDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/png|image\/gif/,
        })
        .addMaxSizeValidator({
          maxSize: 4194304,
        })
        .build({ fileIsRequired: false }),
    )
    image?: Express.Multer.File,
  ): Promise<void> {
    const { id: dropId } = dropIdDto;
    const { title, description, startDate, endDate, totalAmount } =
      updateDropDto;
    const { address: requestUserAddress } = user;
    return await this.dropsService.update(
      dropId,
      requestUserAddress,
      title,
      description,
      image?.buffer,
      startDate,
      endDate,
      totalAmount,
    );
  }

  @Patch('/:id/confirm')
  async confirm(
    @Param() dropIdDto: DropIdDto,
    @GetUser() user: User,
  ): Promise<void> {
    const { id: dropId } = dropIdDto;
    const { address: requestUserAddress } = user;
    return await this.dropsService.confirm(dropId, requestUserAddress);
  }

  @Delete('/:id')
  async delete(
    @Param() dropIdDto: DropIdDto,
    @GetUser() user: User,
  ): Promise<void> {
    const { id } = dropIdDto;
    const { address } = user;
    return await this.dropsService.delete(id, address);
  }
}
