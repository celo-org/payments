export interface KYC {
  given_name: boolean;
  surname: boolean;
  address?: {
    city: boolean;
    country: boolean;
    line1: boolean;
    line2: false;
    postal_code: boolean;
    state: false;
  };
  national_id_data?: {
    id_value: boolean;
    country: boolean;
    type: false;
  };
}
