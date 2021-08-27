import { PaymentMessageRequest } from '@celo/payments-types';

export function buildTypedPaymentRequest(
  message: PaymentMessageRequest,
  chainId: number
) {
  // TODO: figure out a more formal encoding
  const encodedMessage = JSON.stringify(message);
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
      ],
      Request: [{ name: 'encodedMessage', type: 'string' }],
    },
    primaryType: 'Request',
    domain: {
      name: 'Celo Payments',
      version: '1',
      chainId,
    },
    message: {
      encodedMessage,
    },
  };
}
