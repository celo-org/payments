import { PaymentAction, PaymentInfo } from "@celo/payments-types";
import BigNumber from "bignumber.js";
import { getKit } from "../../services";
import { ContractKitTransactionHandler } from "@celo/payments-sdk";

export const Simple: PaymentInfo = {
  requiredPayerData: {
    givenName: false,
    surname: false,
    phoneNumber: true,
    address: {
      city: false,
      country: false,
      line1: false,
      line2: false,
      postalCode: false,
      state: false,
    },
    nationalIdData: {
      idValue: false,
      country: false,
      type: false,
    },
  },
  receiver: {
    accountAddress: "",
    businessData: {
      name: "Acme Autos",
      legalName: "Acme Autos LLC",
      address: {
        city: "San Frans",
        country: "US",
        line1: "1260 Market Street",
        line2: "Suite 450",
        postalCode: "94103",
        state: "CA",
      },
    },
  },
  action: {
    amount: new BigNumber(10).pow(17),
    currency: PaymentAction.currency.C_USD,
    action: PaymentAction.action.CHARGE,
    timestamp: Date.now(),
  },
  referenceId: "00000000-0000-0000-0000000000",
  description: "Mock purchase",
};

getKit().then((kit) => {
  const chainHandler = new ContractKitTransactionHandler(kit);
  Simple.receiver.accountAddress = chainHandler.getSendingAddress();
});
