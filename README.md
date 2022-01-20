# Celo Payments Protocol

This repository houses TypeScript implementations of the Celo Payments Protocol libraries. Currently these include the `Charge` SDK and a reference server.

### Example

You can use the repository CLI to run a wallet, and pay based on a deep link. To run the example, first get the payment deep-link, and then run: 

`npm run cli -- init -d "<deep link>"`

If this is the first time you're running this command, the script will create a blockchain account/private-key for you and ask you to fund it using Celo faucet. Then this account will be used automatically to pay for the requested payment.

