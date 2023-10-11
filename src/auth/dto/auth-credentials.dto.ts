import { IsEthereumAddress, IsString, Length } from 'class-validator';

export class AuthCredentialsDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  @Length(64, 64)
  message: string;

  @IsString()
  signedMessage: string;
}
