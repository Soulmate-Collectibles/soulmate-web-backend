import {
  IsEthereumAddress,
  IsHexadecimal,
  IsString,
  Length,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  @Length(64, 64)
  message: string;

  @IsString()
  @IsHexadecimal()
  @Length(132, 132, { message: 'Signed message must be a valid signature' })
  signedMessage: string;
}
