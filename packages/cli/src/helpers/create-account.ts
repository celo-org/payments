const Web3 = require("web3");
const { join } = require("path");
import { promises as fs } from "fs";
const web3 = new Web3();

export const CeloAccountPrivateKeyFilePath = join(__dirname, "./.secret");

export async function getAccount() {
  try {
    const data = await fs.readFile(CeloAccountPrivateKeyFilePath, {
      encoding: "utf-8",
    });
    return web3.eth.accounts.privateKeyToAccount(data);
  } catch (e) {
    const randomAccount = web3.eth.accounts.create();
    await fs.writeFile(CeloAccountPrivateKeyFilePath, randomAccount.privateKey);
    return randomAccount;
  }
}

module.exports = {
  getAccount,
  CeloAccountPrivateKeyFilePath,
};
