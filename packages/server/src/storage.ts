/**
 * Mock storage layer for the Celo Payments server.
 */

import { ADDRESS } from "./config";

const keys = {
  SUCCESS: "00000000-0000-0000-0000000000",
  INVALID_KYC: "00000000-0000-0000-0000000001",
};

const database = {
  "00000000-0000-0000-0000000000": {
    kyc_data_requirements: {
      required_payer_data: {
        given_name: true,
        surname: true,
      },
    },
    receiver: {
      account_address: ADDRESS,
      business_data: {
        name: "Acme Autos",
        legal_name: "Acme Autos LLC",
        address: "1 Wei St",
      },
    },
    action: {
      amount: "10",
      currency: "cUSD",
      action: "charge",
      timestamp: Date.now(),
    },
    reference_id: "00000000-0000-0000-0000000000",
    description: "Mock purchase",
  },
  "00000000-0000-0000-0000000001": {},
  "00000000-0000-0000-0000000002": {},

  "00000000-0000-0000-0000000099": {},
};

export const get = (id: string) => {
  return database[id] ?? database[keys[id]];
};

export const has = (id: string) => {
  return !!get[id];
};
