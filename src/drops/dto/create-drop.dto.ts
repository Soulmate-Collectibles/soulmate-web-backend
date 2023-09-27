import {
  IsDateString,
  IsEthereumAddress,
  IsInt,
  IsNumber,
  IsNumberString,
  IsString,
  IsUrl,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDropDto {
  @IsString()
  @Length(4, 30)
  title: string;

  @IsString()
  @MaxLength(300)
  description: string;

  @IsUrl()
  image: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumberString()
  // @Min(1)
  // @Max(100)
  totalAmount: number;

  @IsEthereumAddress()
  creatorAddress: string;
}
