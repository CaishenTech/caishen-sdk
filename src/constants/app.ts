import ChainIds from './chain-ids';

export const BASE_URL = 'http://localhost:8080'; //'https://build.caishen.tech';

export enum ChainType {
  BITCOIN = 'BITCOIN',
  SOLANA = 'SOLANA',
  ETHEREUM = 'ETHEREUM',
  SUI = 'SUI',
  APTOS = 'APTOS',
  TON = 'TON',
  NEAR = 'NEAR',
  TRON = 'TRON',
  XRP = 'XRP',
  CARDANO = 'CARDANO',
  COSMOS = 'COSMOS',
}

export interface IWalletAccount {
  chainType: string;
  account: number;
  chainId?: ChainIds;
  rpc?: string;
}
