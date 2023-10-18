import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinataSDK = require('@pinata/sdk');

@Injectable()
export class IpfsService {
  private readonly pinata;

  constructor(private readonly configService: ConfigService) {
    this.pinata = new pinataSDK({
      pinataApiKey: configService.get('PINATA_API_KEY'),
      pinataSecretApiKey: configService.get('PINATA_SECRET_API_KEY'),
    });
  }

  async pinBufferToIpfs(buffer: Buffer): Promise<string> {
    const fileStream: Readable = this.bufferToReadableStream(buffer);
    const options = {
      pinataMetadata: {
        name: 'soulmate',
      },
    };
    const { IpfsHash } = await this.pinata.pinFileToIPFS(fileStream, options);
    return `ipfs://${IpfsHash}`;
  }

  bufferToReadableStream(buffer: Buffer): Readable {
    return Readable.from(buffer);
  }
}
