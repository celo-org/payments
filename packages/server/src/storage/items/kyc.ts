import { ADDRESS } from "../../config";

export const KYC = {
  kyc_data_requirements: {
    required_payer_data: {
      given_name: true,
      surname: true,
      address: {
        city: true,
        country: true,
        line1: true,
        line2: false,
        postal_code: true,
        state: false,
      },
      national_id_data: {
        id_value: true,
        country: true,
        type: true,
      },
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
  reference_id: "00000000-0000-0000-0000000001",
  description: "Mock purchase with lots of required KYC data",
};
