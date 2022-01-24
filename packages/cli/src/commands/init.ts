import cli from "cli-ux";
import { Command, flags } from "@oclif/command";
import { Charge, ContractKitTransactionHandler } from "@celo/payments-sdk";
import { AbortCodes, PaymentInfo } from "@celo/payments-types";
import { getAccountKeys } from "../helpers";
import {
  CeloAccountPrivateKeyFilePath,
  createKitFromPrivateKey,
} from "../helpers/create-account";
import { OnchainFailureError } from "@celo/payments-sdk/build/main/errors/onchain-failure";
import { privateToPublic } from "ethereumjs-util";
import BigNumber from "bignumber.js";

export default class Init extends Command {
  static description = "Create a charge and interactively submit it";

  static examples = [
    `$ payments init --referenceId XXX --baseUrl https://psp.com --privateKey 0x...`,
    `$ payments init --deepLink celo://... --privateKey 0x...`,
  ];

  static flags = {
    apiBase: flags.string({
      char: "u",
      description: "URL of the payment service provider",
    }),
    referenceId: flags.string({
      char: "r",
      description: "Reference ID of the purchase",
    }),
    privateKey: flags.string({
      char: "p",
      description: "Private key of the purchaser",
    }),
    dek: flags.string({
      char: "e",
      description: "Private DEK of the purchaser",
    }),
    testnet: flags.boolean({
      default: true,
      description:
        "Whether to submit transactions on the Celo mainnet or Alfajores testnet",
    }),
    deepLink: flags.string({
      char: "d",
      description: "A deep link presented by the merchant",
    }),
    dontUseAuthentication: flags.boolean({
      char: "a",
      default: false,
      description:
        "Do not authenticate and verify every off-chain command and response",
    }),
  };

  async run() {
    let {
      flags: {
        privateKey,
        testnet,
        referenceId,
        apiBase,
        deepLink,
        dek,
        dontUseAuthentication,
      },
    } = this.parse(Init);
    let charge: Charge;
    const useAuthentication = !dontUseAuthentication;

    try {
      privateKey =
        privateKey ?? (await Init.getPrivateKey("privateKey", testnet));
      if (useAuthentication) {
        dek = dek ?? (await Init.getPrivateKey("dataEncryptionKey", testnet));
        const dekPublicKey = privateToPublic(Buffer.from(dek.slice(2), "hex"));
        cli.info(`DEK public key: ${dekPublicKey.toString("hex")}`);
      } else {
        cli.warn(
          "Not using DEK for authentication. No command or response will be signed or verified."
        );
      }

      const kit = createKitFromPrivateKey(testnet, privateKey, dek);
      const chainHandler = new ContractKitTransactionHandler(kit);

      if (!deepLink) {
        deepLink = await cli.prompt(
          "Enter a deep link or press <Enter> to skip",
          { required: false }
        );
      }
      if (deepLink) {
        charge = Charge.fromDeepLink(deepLink, chainHandler);
      } else {
        if (!referenceId) {
          referenceId = await cli.prompt("Enter a purchase reference ID");
        }
        if (!apiBase) {
          apiBase = await cli.prompt("Enter a PSP base URL");
        }

        charge = new Charge(
          apiBase,
          referenceId,
          chainHandler,
          useAuthentication
        );
      }

      cli.info("");
      cli.info("Payment link details:");
      cli.info(`PSP API base url: ${charge.apiBase}`);
      cli.info(`Payment reference id: ${charge.referenceId}`);

      const info: PaymentInfo = await charge.getInfo();
      cli.info(JSON.stringify(info, null, 2));

      const confirmedByTheUser = await cli.confirm("Continue with payment?");

      if (!confirmedByTheUser) {
        await charge.abort(AbortCodes.CUSTOMER_DECLINED);
        return;
      }

      const defaultPayerData = { phoneNumber: "12345678" };
      await cli.info("The default payer data is:");
      await cli.info(JSON.stringify(defaultPayerData, null, 2));

      const customPayerData = await cli.prompt(
        "Enter a payer data (json) or press <Enter> to skip",
        { required: false, default: undefined }
      );
      if (customPayerData) {
        // TODO: validate customPayerData is in a valid payer data structure
      }

      const amount = await cli.prompt(
        "To change the payment amount, enter it here, or hit <ENTER> to continue with the original amount",
        { required: false, default: info.action.amount.toString()}
      );
      info.action.amount = new BigNumber(amount);

      // No need for further user approval to continue the flow
      try {
        await charge.submit(
          customPayerData ? JSON.parse(customPayerData) : defaultPayerData
        );
      } catch (e) {
        if (e instanceof OnchainFailureError) {
          const sendAbort = await cli.confirm(
            "Submitting onchain transaction failed. Send abort to merchant?"
          );
          if (sendAbort) {
            const codeStr = await cli.prompt(
              "Abort code to send [default: could_not_put_transaction]: ",
              { default: "could_not_put_transaction" }
            );
            let code;
            switch (codeStr) {
              case "insufficient_funds":
                code = AbortCodes.INSUFFICIENT_FUNDS;
                break;
              case "could_not_put_transaction":
              default:
                code = AbortCodes.COULD_NOT_PUT_TRANSACTION;
            }
            await charge.abort(code);
          }
        } else {
          throw e;
        }
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }

  private static async getPrivateKey(
    keyName: string,
    testnet: boolean
  ): Promise<string> {
    cli.info(
      `${keyName} -> Using the one save @ ${CeloAccountPrivateKeyFilePath} (or generating a new one)...`
    );
    const key = (await getAccountKeys(testnet))[keyName];
    cli.info(`${keyName}: ${key}`);
    return key;
  }
}
