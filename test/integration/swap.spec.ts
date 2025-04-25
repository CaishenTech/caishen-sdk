import 'dotenv/config';
import * as assert from 'assert';
import env from 'env-var';

import { CaishenSDK } from '../../src';
import { ChainType } from '../../src/constants';

describe('Integration: SDK Swap', function () {
  const sdk = new CaishenSDK({
    projectKey: env.get('PROJECT_KEY').required().asString(),
  });

  before(async () => {
    await sdk.connectAsUser({
      token: env.get('USER_TOKEN').required().asString(),
      provider: env.get('USER_PROVIDER').default('custom').asString(),
    });
  });

  beforeEach((done) => {
    setTimeout(done, 1_000);
  });

  const MIN_UNITS0 = '1000000000000';
  const MIN_UNITS1 = '1000000000000000';
  const MIN_UNITS2 = '1000000';

  describe(`Swap on ARB`, function () {
    it(`should swap ${MIN_UNITS0} wei to USDT0`, async () => {
      const route = await sdk.crypto.getSwapRoute({
        wallet: {
          account: 1,
        },
        payload: {
          amount: MIN_UNITS0,
          from: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            chainType: ChainType.ETHEREUM,
            chainId: 42161,
          },
          to: {
            tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
            chainType: ChainType.ETHEREUM,
            chainId: 42161,
          },
        },
      });

      assert.strictEqual(
        typeof route?.confirmationCode,
        'string',
        'should return confirmation code to execute route',
      );

      const result = await sdk.crypto.swap({
        wallet: {
          account: 1,
          chainType: ChainType.ETHEREUM,
        },
        payload: {
          confirmationCode: route.confirmationCode,
        },
      });

      assert.ok(result);
    });
  });

  describe(`Bridge ETH (Arbitrum) -> USDT (Solana)`, function () {
    it(`should swap ${MIN_UNITS1} wei on ARB to USDT on Solana`, async () => {
      const route = await sdk.crypto.getSwapRoute({
        wallet: {
          account: 1,
        },
        payload: {
          amount: MIN_UNITS1,
          from: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            chainType: ChainType.ETHEREUM,
            chainId: 42161,
          },
          to: {
            tokenAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
            chainType: ChainType.SOLANA,
          },
        },
      });

      assert.strictEqual(
        typeof route?.confirmationCode,
        'string',
        'should return confirmation code to execute route',
      );

      const result = await sdk.crypto.swap({
        wallet: {
          account: 1,
          chainType: ChainType.ETHEREUM,
        },
        payload: {
          confirmationCode: route.confirmationCode,
        },
      });

      assert.ok(result);
    });
  });

  describe(`Bridge BTC -> BNB (Binance Smart Chain)`, function () {
    it(`should swap ${MIN_UNITS2} satoshi to BNB on BSC`, async () => {
      const route = await sdk.crypto.getSwapRoute({
        wallet: {
          account: 1,
        },
        payload: {
          amount: MIN_UNITS1,
          from: {
            tokenAddress: 'bitcoin',
            chainType: ChainType.BITCOIN,
          },
          to: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            chainType: ChainType.ETHEREUM,
            chainId: 56,
          },
        },
      });

      assert.strictEqual(
        typeof route?.confirmationCode,
        'string',
        'should return confirmation code to execute route',
      );

      const result = await sdk.crypto.swap({
        wallet: {
          account: 1,
          chainType: ChainType.BITCOIN,
        },
        payload: {
          confirmationCode: route.confirmationCode,
        },
      });

      assert.ok(result);
    });
  });
});
