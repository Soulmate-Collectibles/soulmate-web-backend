import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';

@Injectable()
export class NftGatewayService {
  constructor(private readonly configService: ConfigService) {}

  async getNFTs(walletAddress: string) {
    try {
      await Moralis.start({
        apiKey: this.configService.get('MORALIS_API_KEY'),
      });

      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: '0xaa36a7', // sepolia chain
        format: 'decimal', // tokenID format
        tokenAddresses: ['0xFB76F7181439E306c3BF71c39F6eaa7e45b26DA1'], // Soulmate contract
        mediaItems: false,
        address: walletAddress, // Wallet
      });
      return response.raw;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error getting NFTs');
    }
  }
}
