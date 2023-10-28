import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as contractABI from './soulmate.json';

@Injectable()
export class ContractService {
  private readonly contract;

  constructor(private readonly configService: ConfigService) {
    const provider = new ethers.EtherscanProvider(
      'sepolia',
      configService.get('ETHERS_API_KEY'),
    );

    const wallet = new ethers.Wallet(
      configService.get('WALLET_PRIVATE_KEY'),
      provider,
    );

    const contractAddress = '0xFB76F7181439E306c3BF71c39F6eaa7e45b26DA1';
    this.contract = new ethers.Contract(contractAddress, contractABI, wallet);
  }

  async safeMint(toAddress: string, tokenURI: string) {
    try {
      const tx = await this.contract.safeMint(toAddress, tokenURI);
      //await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error minting token');
    }
  }
}
