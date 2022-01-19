import test from 'ava';
import { SignedTxRepo } from './contract-kit';
import { EncodedTransaction } from '@celo/connect';
import { PaymentAction } from '@celo/payments-types';
import BigNumber from 'bignumber.js';

test('SignedTransactionStorage return a different encoded if a different payment info requested', async (t) => {
  const storage = new SignedTxRepo();
  const info1 = {
    requiredPayerData: {
      givenName: false,
      surname: false,
      phoneNumber: true,
      address: {
        city: false,
        country: false,
        line1: false,
        line2: false,
        postalCode: false,
        state: false,
      },
      nationalIdData: {
        idValue: false,
        country: false,
        type: false,
      },
    },
    receiver: {
      accountAddress: '',
      businessData: {
        name: 'Acme Autos',
        legalName: 'Acme Autos LLC',
        address: {
          city: 'San Frans',
          country: 'US',
          line1: '1260 Market Street',
          line2: 'Suite 450',
          postalCode: '94103',
          state: 'CA',
        },
      },
    },
    action: {
      amount: new BigNumber(10).pow(17),
      currency: PaymentAction.currency.C_USD,
      action: PaymentAction.action.CHARGE,
      timestamp: Date.now(),
    },
    referenceId: '00000000-0000-0000-0000-000000000000',
    description: 'Mock purchase',
  };
  const info2 = {
    requiredPayerData: {
      givenName: false,
      surname: false,
      phoneNumber: true,
      address: {
        city: false,
        country: false,
        line1: false,
        line2: false,
        postalCode: false,
        state: false,
      },
      nationalIdData: {
        idValue: false,
        country: false,
        type: false,
      },
    },
    receiver: {
      accountAddress: '',
      businessData: {
        name: 'Acme Autos',
        legalName: 'Acme Autos LLC',
        address: {
          city: 'San Frans',
          country: 'US',
          line1: '1260 Market Street',
          line2: 'Suite 450',
          postalCode: '94103',
          state: 'CA',
        },
      },
    },
    action: {
      amount: new BigNumber(10).pow(17),
      currency: PaymentAction.currency.C_USD,
      action: PaymentAction.action.CHARGE,
      timestamp: Date.now(),
    },
    referenceId: '00000000-0000-0000-0000-000000000001',
    description: 'Mock purchase',
  };

  const txHash1 = await storage.getSignedTransaction(
    info1,
    async () =>
      ({
        raw: '0x12345',
        tx: {
          nonce: '1',
        },
      } as EncodedTransaction)
  );
  const txHash2 = await storage.getSignedTransaction(
    info2,
    async () =>
      ({
        raw: '0x67890',
        tx: {
          nonce: '2',
        },
      } as EncodedTransaction)
  );

  t.not(txHash1, txHash2);
});

test('SignedTransactionStorage return the same encoded if the same payment info requested', async (t) => {
  const storage = new SignedTxRepo();
  const info = {
    requiredPayerData: {
      givenName: false,
      surname: false,
      phoneNumber: true,
      address: {
        city: false,
        country: false,
        line1: false,
        line2: false,
        postalCode: false,
        state: false,
      },
      nationalIdData: {
        idValue: false,
        country: false,
        type: false,
      },
    },
    receiver: {
      accountAddress: '',
      businessData: {
        name: 'Acme Autos',
        legalName: 'Acme Autos LLC',
        address: {
          city: 'San Frans',
          country: 'US',
          line1: '1260 Market Street',
          line2: 'Suite 450',
          postalCode: '94103',
          state: 'CA',
        },
      },
    },
    action: {
      amount: new BigNumber(10).pow(17),
      currency: PaymentAction.currency.C_USD,
      action: PaymentAction.action.CHARGE,
      timestamp: Date.now(),
    },
    referenceId: '00000000-0000-0000-0000-000000000000',
    description: 'Mock purchase',
  };

  const txHash1 = await storage.getSignedTransaction(
    info,
    async () =>
      ({
        raw: '0x12345',
        tx: {
          nonce: '1',
        },
      } as EncodedTransaction)
  );
  const txHash2 = await storage.getSignedTransaction(info, async () => {
    throw new Error('should not request to signed an already signed tx');
  });

  t.is(txHash1, txHash2);
});
