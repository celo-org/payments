import { PaymentAction, PaymentInfo } from "@celo/payments-types";
import BigNumber from "bignumber.js";
import { getKit } from "../../services";
import { ContractKitTransactionHandler } from "@celo/payments-sdk";

export const KYC: PaymentInfo = {
  requiredPayerData: {
    givenName: true,
    surname: true,
    phoneNumber: true,
    address: {
      city: true,
      country: true,
      line1: true,
      line2: false,
      postalCode: true,
      state: false,
    },
    nationalIdData: {
      idValue: true,
      country: true,
      type: true,
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
    amount: new BigNumber(10).pow(17).multipliedBy(2),
    currency: PaymentAction.currency.C_USD,
    action: PaymentAction.action.CHARGE,
    timestamp: Date.now(),
  },
  referenceId: "00000000-0000-0000-0000-000000000001",
  description: "Mock purchase",
};

getKit().then((kit) => {
  const chainHandler = new ContractKitTransactionHandler(kit);
  KYC.receiver.accountAddress = chainHandler.getSendingAddress();
});
