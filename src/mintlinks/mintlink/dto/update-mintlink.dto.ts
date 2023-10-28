import { IsNumberString } from 'class-validator';

export class UpdateMintlinkDto {
  @IsNumberString()
  remainingUses: number;
}
