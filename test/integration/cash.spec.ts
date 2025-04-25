import 'dotenv/config';
import env from 'env-var';
import * as assert from 'assert';

import { CaishenSDK } from '../../src';

describe('Integration: SDK Cash', function () {
  const sdk = new CaishenSDK({
    projectKey: env.get('PROJECT_KEY').required().asString(),
  });

  before(async () => {
    await sdk.connectAsUser({
      token: env.get('USER_TOKEN').required().asString(),
      provider: env.get('USER_PROVIDER').default('custom').asString(),
    });
  });

  describe('Supported Tokens', () => {
    it('should get supported tokens', async () => {
      const tokens = await sdk.cash.getSupportedTokens();

      assert.strictEqual(
        Array.isArray(tokens) &&
          tokens.every(
            (token) => typeof token === 'object' && 'address' in token,
          ),
        true,
        'should return array of supported tokens',
      );
    });
  });

  describe('Check Balance', () => {
    it('should get balance', async () => {
      const balance = await sdk.cash.getBalance({ account: 1 });

      assert.strictEqual(
        'balance' in balance &&
          'balanceRaw' in balance &&
          +balance.balance >= 0,
        true,
        'should return balance of account',
      );
    });
  });

  describe('Deposit', () => {
    it('should get balance', async () => {
      const result = await sdk.cash.deposit({
        amount: '1',
        account: 1,
        tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        chainId: 42161,
      });

      assert.ok(result);
    });
  });
});
