import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
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

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(40)
  totalAmount: number;
}
