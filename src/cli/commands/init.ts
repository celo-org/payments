import { newKit } from '@celo/contractkit';
import { Command, flags } from '@oclif/command';
import { Charge } from '../../charge';
import { ContractKitTransactionHandler } from '../../handlers';

export default class Init extends Command {
  static description = 'describe the command here';

  static examples = [
    `$ payments init --referenceId XXX --baseUrl https://psp.com --privateKey 0x...`,
  ];

  static flags = {
    baseUrl: flags.string({
      char: 'u',
      description: 'URL of the payment service provider',
      required: true,
    }),
    referenceId: flags.string({
      char: 'r',
      description: 'Reference ID of the purchase',
      required: true,
    }),
    privateKey: flags.string({
      char: 'p',
      description: 'Private key of the purchasee',
      required: true,
    }),
    rpcUrl: flags.string({
      default: 'https://alfajores-forno.celo-testnet.org',
      description: 'RPC URL of the node transactions are being submitted to',
    }),
  };

  async run() {
    const { flags } = this.parse(Init);

    const kit = newKit(flags.rpcUrl);
    kit.addAccount(flags.privateKey);

    new Charge(
      flags.baseUrl,
      flags.referenceId,
      new ContractKitTransactionHandler(kit)
    );

    // TODO: continue this flow with prompts
  }
}
