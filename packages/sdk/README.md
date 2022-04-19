# Payments SDK

## Charge
This is the main export that wallets will want to integrate with. It allows
you to get the payment info and subsequently make the payment transaction.


Example run through of Charge usage
```typescript
// The api url that the Charge instance will be communicating with.
const apiBase = 'merchantpayments.com/api';
// The id of the payment request used by the api. The api will need
// to create a payment object for the SDK to respond to. This will
// need to have the info in the PaymentInfo type and the referenceId
// will refer to this object.
const referenceId = '123abc';
// The 'ChainHandler' instance imported from the payments-sdk and initialized
// with a contract kit instance. This kit will represent the Payer in the process.
const chainHandler = new ContractKitTransactionHandler(kit);
// Whether or not a DEK should be used for authorizing on chain transactions.
const useAuthentication = true;
// How many times requests should be retried.
const retries = 4;

const charge = new Charge(
  apiBase,
  referenceId,
  chainHandler,
  useAuthentication,
  retries
);

// The info regarding the payment matching the reference id coming
// from the api. See @celo/payment-types PaymentInfo.
// Includes the requiredPayerData field that must be used for the
// submit method. Also, includes payment meta data to show to the
// user.
const paymentInfo: PaymentInfo = await charge.getInfo()

// Examples
// How much
console.log(paymentInfo.action.amount);
// What token
console.log(paymentInfo.action.currency);

// The api might require some KYC data on the payer. This will
// be passed into the submit method.
const payerDataExample = {
  phoneNumber: '12345678',
};

try {
  // This is the method to submit the transaction on chain
  await charge.submit(payerDataExample);
} catch(e) {
  // If for some reason the transaction fails to submit the promise
  // returned by submit will be rejected.
  // The charge can be aborted to let the api know not to continue
  // watching for the transaction. See @celo/payment-types AbortCodes
  // for abort code options.
  charge.abort(AbortCodes.INSUFFICIENT_FUNDS)
}

// Reaching here would mean the payment was successfully submitted
// on chain.
console.log("Payment submitted");

```


## ChainHandlers
Wrappers to help the PaymentsSDK interact with the blockchain.

### ContractKitTransactionHandler
Used to wrap ContractKit to make a ChainHandler for the Charge class


## Helpers
A variety of helper methods to facilitate payments-sdk interactions
