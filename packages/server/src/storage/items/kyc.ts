import { GetInfoResponse } from "@celo/payments-types";
import { ADDRESS } from "../../config";

export const KYC: GetInfoResponse = {
  requiredPayerData: {
    givenName: true,
    surname: true,
    phoneNumber: false,
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
    accountAddress: ADDRESS,
    businessData: {
      name: "Acme Autos",
      legalName: "Acme Autos LLC",
      imageUrl: "",
      address: {
        city: "Test",
        country: "Test",
        line1: "1",
        line2: "2",
        postalCode: "1",
        state: "1",
      },
    },
  },
  action: {
    amount: 10,
    currency: "cUSD",
    action: "charge",
    timestamp: Date.now(),
  },
  referenceId: "00000000-0000-0000-0000000001",
  description: "Mock purchase with lots of required KYC data",
};
