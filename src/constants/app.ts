import ChainIds from './chain-ids'

export const SUPPORTED_CHAINS = [
	'BITCOIN',
	'ETHEREUM',
	'SOLANA',
	'SUI',
  'APTOS',
  'TON',
  'NEAR',
  'TRON',
  'XRP',
  'CARDANO',
  'COSMOS'
]

export const BASE_URL = 'https://build.caishen.xyz';
export const SECRET: any = 'newmoneyai_secret'

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
  COSMOS = 'COSMOS'
}

export interface IWalletAccount {
  chainType: string; 
  account: number;
  chainId?: ChainIds
  rpc?: string;
}