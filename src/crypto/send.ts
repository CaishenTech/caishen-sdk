import axios from 'axios';

import { BASE_URL, IWalletAccount } from '../constants';
import type { CaishenSDK } from '../caishen';

export async function approve(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: IWalletAccount;
    payload: {
      token: string;
      amount: string;
      toAddress: string;
    };
  },
): Promise<string> {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
    const url = `${BASE_URL}/api/crypto/approve`;
    const response = await axios.post(
      url,
      {
        wallet,
        payload,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to send transaction: ${error.response?.data?.message || error.message}`,
    );
  }
}
/*
  if payload?.token is undefined or null, send gas token.
  Otherise - send tokens
*/
export async function send(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: IWalletAccount;
    payload: {
      token?: string;
      amount: string;
      toAddress: string;
      memo?: number;
    };
  },
): Promise<string> {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
    const url = `${BASE_URL}/api/crypto/send`;
    const response = await axios.post(
      url,
      {
        wallet,
        payload,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to send transaction: ${error.response?.data?.message || error.message}`,
    );
  }
}

export async function sendTxn(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: IWalletAccount;
    payload: {
      toAddress: string;
      txData: number;
    };
  },
): Promise<string> {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
    const url = `${BASE_URL}/api/crypto/send_tx`;
    const response = await axios.post(
      url,
      {
        wallet,
        payload,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to send transaction: ${error.response?.data?.message || error.message}`,
    );
  }
}
/*
  if payload?.token is undefined or null, get native token balance.
  Otherise - get token balance
*/
export async function getBalance(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: IWalletAccount;
    payload: { token?: string };
  },
): Promise<string> {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
    const url = `${BASE_URL}/api/crypto/balance`;
    const response = await axios.get(url, {
      params: {
        ...wallet,
        tokenAddress: payload.token,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to get balance');
  }
}

export async function getAllowance(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: IWalletAccount;
    payload: { tokenAddress: string, account: string };
  },
): Promise<string> {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
    const url = `${BASE_URL}/api/crypto/allowance`;
    const response = await axios.get(url, {
      params: {
        ...wallet,
        tokenAddress: payload.tokenAddress,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to get balance');
  }
}

/*
  use Dune API to get all token balances for address
*/
export async function getTokenBalances(
  this: CaishenSDK,
  {
    wallet,
  }: {
    wallet: IWalletAccount;
  },
) {
  const url = `${BASE_URL}/api/crypto/balances`;
}
