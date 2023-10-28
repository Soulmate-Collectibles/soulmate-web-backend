import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Metadata } from '../mintlinks/mintlink/metadata.interface';
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
        name: 'soulmate_image',
      },
    };
    try {
      const { IpfsHash } = await this.pinata.pinFileToIPFS(fileStream, options);
      return `ipfs://${IpfsHash}`;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error pinning image to IPFS');
    }
  }

  async pinJSONToIpfs(metadata: Metadata): Promise<string> {
    const options = {
      pinataMetadata: {
        name: 'soulmate_metadata',
      },
    };
    try {
      const { IpfsHash } = await this.pinata.pinJSONToIPFS(metadata, options);
      return `ipfs://${IpfsHash}`;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error pinning metadata to IPFS');
    }
  }

  bufferToReadableStream(buffer: Buffer): Readable {
    return Readable.from(buffer);
  }
}
