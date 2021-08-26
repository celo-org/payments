export interface GetInfoResponse {
  requiredPayerData: {
    givenName: boolean;
    surname: boolean;
    phoneNumber: boolean;
    address: {
      city: boolean;
      country: boolean;
      line1: boolean;
      line2: boolean;
      postalCode: boolean;
      state: boolean;
    };
    nationalIdData: {
      idValue: boolean;
      country: boolean;
      type: boolean;
    };
  };
  receiver: {
    accountAddress: string;
    businessData: {
      name: string;
      legalName: string;
      imageUrl: string;
      address: {
        city: string;
        country: string;
        line1: string;
        line2: string;
        postalCode: string;
        state: string;
      };
    };
  };
  action: {
    amount: number;
    currency: "cUSD";
    action: "charge";
    timestamp: number;
  };
  referenceId: string;
  description: string;
}
