import { newKit } from "@celo/contractkit";
import { promises as fs } from "fs";
import { ContractKit } from "@celo/contractkit/lib/kit";

const { join } = require("path");

export const CeloAccountPrivateKeyFilePath = join(__dirname, "./.secret");

const context = {};

export function createKitFromPrivateKey(
  privateKey: string,
  dek?: string
): ContractKit {
  const kit = newKit("https://alfajores-forno.celo-testnet.org");
  kit.addAccount(privateKey);
  if (dek) {
    kit.addAccount(dek);
  }
  const [defaultAccount] = kit.getWallet().getAccounts();
  kit.defaultAccount = defaultAccount;
  return kit;
}

async function getAccountKeys() {
  try {
    const data = await fs.readFile(CeloAccountPrivateKeyFilePath, {
      encoding: "utf-8",
    });
    return JSON.parse(data);
  } catch (e) {
    console.error(
      `No .secret found (should be @ ${CeloAccountPrivateKeyFilePath}).`
    );
    console.error(
      `** You probably want to run "yarn setup" before "yarn start"`
    );
    throw e;
  }
}

export async function getKit(): Promise<ContractKit> {
  if (context["kit"]) return context["kit"];

  const keys = await getAccountKeys();
  Object.assign(context, ...keys);
  context["kit"] = createKitFromPrivateKey(
    keys["privateKey"],
    keys["dataEncryptionKey"]
  );

  return context["kit"];
}
