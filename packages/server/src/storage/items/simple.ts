import { ADDRESS } from "../../config";
import {
  Address,
  BusinessData,
  PaymentAction,
  PaymentInfo,
} from "@celo/payments-types";

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
    accountAddress: ADDRESS,
    businessData: <BusinessData>{
      name: "Acme Autos",
      legalName: "Acme Autos LLC",
      address: <Address>{
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
    amount: 0.1,
    currency: PaymentAction.currency.C_USD,
    action: PaymentAction.action.CHARGE,
    timestamp: Date.now(),
  },
  referenceId: "00000000-0000-0000-0000000000",
  description: "Mock purchase",
};
