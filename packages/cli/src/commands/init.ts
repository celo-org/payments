import { newKit } from "@celo/contractkit";
import { Command, flags } from "@oclif/command";
import { Charge, ContractKitTransactionHandler } from "@celo/payments-sdk";
import { AbortCode } from "@celo/payments-types";
import cli from "cli-ux";

export default class Init extends Command {
  static description = "Create a charge and interactively submit it";

  static examples = [
    `$ payments init --referenceId XXX --baseUrl https://psp.com --privateKey 0x...`,
  ];

  static flags = {
    baseUrl: flags.string({
      char: "u",
      description: "URL of the payment service provider",
    }),
    referenceId: flags.string({
      char: "r",
      description: "Reference ID of the purchase",
    }),
    privateKey: flags.string({
      char: "p",
      description: "Private key of the purchasee",
    }),
    testnet: flags.boolean({
      default: true,
      description:
        "Whether to submit transactions on the Celo mainnet or Alfajores testnet",
    }),
  };

  async run() {
    let {
      flags: { privateKey, testnet, referenceId, baseUrl },
    } = this.parse(Init);

    if (!privateKey) {
      privateKey = await cli.prompt(
        "Enter a private key to sign transactions with",
        { type: "hide" }
      );
    }
    if (!referenceId) {
      referenceId = await cli.prompt("Enter a purchase reference ID");
    }
    if (!baseUrl) {
      baseUrl = await cli.prompt("Enter a PSP base URL");
    }

    const kit = newKit(
      testnet
        ? "https://alfajores-forno.celo-testnet.org"
        : "https://forno.celo.org"
    );

    kit.addAccount(privateKey);

    const charge = new Charge(
      baseUrl,
      referenceId,
      new ContractKitTransactionHandler(kit)
    );

    const info = await charge.getInfo();
    console.log(JSON.stringify(info, null, 2));

    const confirmed = await cli.confirm("Continue with payment?");
    if (confirmed) {
      await charge.submit({});
    } else {
      await charge.abort(AbortCode.user_declined_payment);
    }
    // TODO: continue this flow with prompts
  }
}
