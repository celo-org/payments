import { promises as fs } from "fs";
import { privateToPublic } from "ethereumjs-util";
import {
  createKitFromPrivateKey,
  CeloAccountPrivateKeyFilePath,
} from "../src/services";
import cli from "cli-ux";

const Web3 = require("web3");
const web3 = new Web3();

async function setupAccountKeys() {
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

    await cli.info(`The server account address is: ${randomAccount.address}`);
    await cli.info(
      "Go to https://celo.org/developers/faucet to fund it before continuing"
    );
    await cli.prompt("Press <Enter> after funding the account to continue...", {
      required: false,
    });

    const kit = createKitFromPrivateKey(randomAccountPrivateKey);
    const dekPublicKey = privateToPublic(
      Buffer.from(randomDekPrivateKey.slice(2), "hex")
    );
    await (await kit.contracts.getAccounts())
      .setAccountDataEncryptionKey(`0x${dekPublicKey.toString("hex")}`)
      .sendAndWaitForReceipt();

    await fs.writeFile(
      CeloAccountPrivateKeyFilePath,
      JSON.stringify(keysObject)
    );
    return keysObject;
  }
}

(async () => {
  await setupAccountKeys();
  console.log("Done");
})();
