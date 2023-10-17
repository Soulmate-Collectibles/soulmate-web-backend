import { IsEthereumAddress } from 'class-validator';

export class UserAddressDto {
  @IsEthereumAddress()
  address: string;
}
