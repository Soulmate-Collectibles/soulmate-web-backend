import { IsHexadecimal, IsOptional } from 'class-validator';

export class GetUsersFilterDto {
  @IsOptional()
  @IsHexadecimal()
  search?: string;
}
