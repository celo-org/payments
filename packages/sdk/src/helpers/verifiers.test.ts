import { GetPaymentInfoRequest, OffchainHeaders } from '@celo/payments-types';
import test from 'ava';
import { verifyRequestSignature } from '.';
import { ChainHandlerForAuthentication } from '..';

const SENDING_ADDRESS = '0x934097c9f4d7632001bdd431b1212f1f180c6fd7';

class MockedChainHandler implements ChainHandlerForAuthentication {
  async signTypedPaymentRequest(_data: any): Promise<string | undefined> {
    return '';
  }

  getSendingAddress(): string {
    return '0xdeadbeef';
  }

  async getChainId(): Promise<number> {
    return 44787;
  }

  async getDataEncryptionKey(account: string): Promise<string> {
    if (account === SENDING_ADDRESS) {
      return '0x13ab04e2f16820c64c065ada37ae2c71e7898d65f387b79852aa830acaff3e65cfd96356738507083c9919c1de3b153299bb1bca1b836204fdfc70419270d338';
    }
    return '';
  }
}

test('verifyRequestSignature for valid request', async (t) => {
  const mockedChainHandler = new MockedChainHandler();
  const [valid, errors] = await verifyRequestSignature(
    mockedChainHandler,
    {
      [OffchainHeaders.SIGNATURE]:
        '0x1b48361b4982ffe80b74cf80b508ac32ba476e64c397461833963543706a8e2c3d49d1ba7b3dc3c83b15d551bf2dc4b007da9c553a5601f1dfd3245e1ba2e492c5',
      [OffchainHeaders.ADDRESS]: SENDING_ADDRESS,
    },
    {
      method: GetPaymentInfoRequest.method.value,
      params: {
        referenceId: '00000000-0000-0000-0000000000',
      },
      id: 223077442933971,
      jsonrpc: '2.0',
    }
  );

  t.is(valid, true);
  t.is(errors.length, 0);
});

test('verifyRequestSignature for valid request without message orders - should pass', async (t) => {
  const mockedChainHandler = new MockedChainHandler();
  const [valid, errors] = await verifyRequestSignature(
    mockedChainHandler,
    {
      [OffchainHeaders.SIGNATURE]:
        '0x1b48361b4982ffe80b74cf80b508ac32ba476e64c397461833963543706a8e2c3d49d1ba7b3dc3c83b15d551bf2dc4b007da9c553a5601f1dfd3245e1ba2e492c5',
      [OffchainHeaders.ADDRESS]: SENDING_ADDRESS,
    },
    {
      id: 223077442933971,
      jsonrpc: '2.0',
      method: GetPaymentInfoRequest.method.value,
      params: {
        referenceId: '00000000-0000-0000-0000000000',
      },
    }
  );

  t.is(valid, true);
  t.is(errors.length, 0);
});
