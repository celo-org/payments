import cli from "cli-ux";

const Web3 = require("web3");
const { join } = require("path");
import { promises as fs } from "fs";
import { newKit } from "@celo/contractkit";
import { privateToPublic } from "ethereumjs-util";
const web3 = new Web3();

export const CeloAccountPrivateKeyFilePath = join(__dirname, "./.secret");

export function createKitFromPrivateKey(
  testnet: boolean,
  privateKey: string,
  dek?: string
) {
  const kit = newKit(
    testnet
      ? "https://alfajores-forno.celo-testnet.org"
      : "https://forno.celo.org"
  );
  kit.addAccount(privateKey);
  if (dek) {
    kit.addAccount(dek);
  }
  const [defaultAccount] = kit.getWallet().getAccounts();
  kit.defaultAccount = defaultAccount;
  return kit;
}

export async function getAccountKeys(testnet: boolean) {
  try {
    const data = await fs.readFile(CeloAccountPrivateKeyFilePath, {
      encoding: "utf-8",
    });
    return JSON.parse(data);
  } catch (e) {
    const randomAccount = web3.eth.accounts.create();
    const randomAccountPrivateKey = randomAccount.privateKey;
    const randomDekPrivateKey = web3.eth.accounts.create().privateKey;

    const keysObject = {
      privateKey: randomAccountPrivateKey,
      dataEncryptionKey: randomDekPrivateKey,
    };

    await cli.info(
      `Your new wallet account address is: ${randomAccount.address}`
    );
    await cli.info(
      "Go to https://celo.org/developers/faucet before continuing"
    );
    await cli.prompt("Press <Enter> after funding the account to continue...", {
      required: false,
    });

    const kit = createKitFromPrivateKey(testnet, randomAccountPrivateKey);
    const dekPublicKey = privateToPublic(
      Buffer.from(randomDekPrivateKey.slice(2), "hex")
    );
    cli.info(`Setting DEK for account ${randomAccount.address}`);
    await (await kit.contracts.getAccounts())
      .setAccountDataEncryptionKey(`0x${dekPublicKey.toString("hex")}`)
      .sendAndWaitForReceipt();
    cli.info(`Done`);

    await fs.writeFile(
      CeloAccountPrivateKeyFilePath,
      JSON.stringify(keysObject)
    );
    return keysObject;
  }
}

module.exports = {
  getAccountKeys,
  createKitFromPrivateKey,
  CeloAccountPrivateKeyFilePath,
};
