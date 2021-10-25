# Celo Payments Protocol

This repository houses TypeScript implementations of the Celo Payments Protocol libraries. Currently these include the `Charge` SDK and a reference server.

## Requirements

This is the exhaustive list of requirements to run this repository

- `node 12`
- `yarn`
- A `CELO` private key for development purposes.
- A `DEK` for development purposes.

#### Regarding the CELO private key

For one-off uses, simply use `celocli account:new`. To get the CELO CLI, follow the instructions here: https://docs.celo.org/command-line-interface/introduction.

To make things a bit simpler, I recommend running that command to create a .env file for testing:

```
# Make sure you're working on alfajores network
celocli config:set --node https://alfajores-forno.celo-testnet.org/

# Create an account and store it well formatted in an .env file
celocli account:new | sed -E 's/: (.+)/="\1"/g' | grep '=' > .env
source .env

# Copy the account address to your clipboard
echo $accountAddress | pbcopy

# Head to the faucet to get some money and paste your account address there
open https://celo.org/developers/faucet

# Verify you got money successfully
celocli account:balance $accountAddress

# Register your account
celocli account:register --from $accountAddress -k $privateKey
```

#### Regarding the DEK

For the server to know about your DEK, your account created above _needs_ to be [registered](https://docs.celo.org/command-line-interface/account#celocli-accountregister) and have the public key of your DEK [registered too](https://docs.celo.org/command-line-interface/account#celocli-accountregister-data-encryption-key).

To do this, these commands may be useful:

```
# Register a public data encryption key
celocli account:register-data-encryption-key --from $accountAddress -k privateKey --publicKey <DEK_PUBLIC_KEY>
```

TODO: explain why the private key generated above in `account:new` can't be used as a DEK and a different private key needs to be used.
TODO: add an easy way to generate a DEK or to bypass it completely

## How to run each package

The payments monorepo is composed of a couple packages. But only 2 are meant to be used from the outside: the CLI and the development server. The other packages (sdk, types, and utils) are used by the CLI and server respectively.

First, run `yarn && yarn lerna bootstrap` to install the dependencies and bootstrap the monorepo.

### The payments API reference server

You can run `yarn start` to run the server with hot-reloading enabled. It will run by default on port 3000, useful for the next section.

### The payments CLI

Run the payment CLI in interactive mode `yarn cli init -p <PRIVATE_KEY> -d <DEK> -u http://localhost:3000 -r SIMPLE` from the root of the repository. You can also see the full list of available flags via `yarn cli init --help` and all available commands via `yarn cli help`.
You may also omit all the flags to run the command interactively. (TODO: add an option to add the dek interactively)
