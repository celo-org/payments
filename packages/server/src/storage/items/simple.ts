import { ADDRESS } from "../../config";

export const Simple = {
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
};
