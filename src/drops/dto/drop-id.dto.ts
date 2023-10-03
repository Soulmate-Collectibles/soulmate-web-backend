import { IsUUID } from 'class-validator';

export class DropIdDto {
  @IsUUID()
  id: string;
}
