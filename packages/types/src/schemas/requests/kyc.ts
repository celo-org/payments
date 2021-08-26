export interface KYC {
  givenName: boolean;
  surname: boolean;
  address?: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postalCode: string;
    state: string;
  };
  nationalIdData?: {
    idValue: string;
    country: string;
    type: string;
  };
}
