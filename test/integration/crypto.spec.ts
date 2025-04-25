import 'dotenv/config';
import * as assert from 'assert';
import env from 'env-var';

import { CaishenSDK } from '../../src';
import { BLOCKCHAIN_CONFIGS } from '../support';

describe('Integration: SDK Crypto', function () {
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
    setTimeout(done, 600);
  });

  describe('Supported Wallets', function () {
    it('should get supported wallet types', async () => {
      const walletsSupported = await sdk.crypto.getSupportedChainTypes();

      assert.strictEqual(
        Array.isArray(walletsSupported) &&
          walletsSupported.every((v) => typeof v === 'string'),
        true,
        'should return supported blockchain types',
      );
    });
  });

  for (const config of BLOCKCHAIN_CONFIGS) {
    const chainId = config.chainId
      ? ` (Chain ID: ${config.chainId} - ${config.name})`
      : '';

    describe(`${config.type.toUpperCase()}${chainId}`, function () {
      it('should get wallet', async () => {
        const wallet = await sdk.crypto.getWallet({
          account: 1,
          chainType: config.type,
          chainId: config.chainId,
        });

        const actual =
          typeof wallet.chainType === 'string' &&
          typeof wallet.address === 'string' &&
          typeof wallet.publicKey === 'string' &&
          (!wallet.privateKey || typeof wallet.privateKey === 'string') &&
          +wallet.account >= 1;

        assert.strictEqual(
          actual,
          true,
          'should return address, public key, account number and private key as string (optional)',
        );
      });

      for (const token of config.tokens || []) {
        it(`should get balance (${token.symbol})`, async function () {
          const balance = await sdk.crypto.getBalance({
            wallet: {
              account: 1,
              chainId: config.chainId,
              chainType: config.type,
            },
            payload: {
              token: ('address' in token && token.address) || undefined,
            },
          });

          assert.strictEqual(
            BigInt(balance) >= BigInt(0),
            true,
            'should return balance in base units and equal or greater than zero',
          );
        });
      }

      // NOTE: may fail due to insufficient balance
      for (const token of config.tokens || []) {
        const minUnits4Send = '1000';

        it(`should send ${minUnits4Send} units of ${token.symbol} token`, async function () {
          const transactionHash = await sdk.crypto.send({
            wallet: {
              account: 1,
              chainId: config.chainId,
              chainType: config.type,
              rpc:
                (config.chainId &&
                  (await sdk.crypto
                    .getRPC(config.chainId)
                    .catch(() => undefined))) ||
                undefined,
            },
            payload: {
              token: ('address' in token && token.address) || undefined,
              toAddress: config.transferDest.address,
              memo: config.transferDest.memo,
              amount: minUnits4Send,
            },
          });

          assert.strictEqual(
            typeof transactionHash,
            'string',
            'should return transaction hash',
          );
        });
      }
    });
  }
});
