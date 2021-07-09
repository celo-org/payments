import { Address } from '@celo/base';
import { StableToken } from '@celo/contractkit';
export interface GetInfo {
    kyc_data_requirements: {
        required_payer_data?: {
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
        };
    };
    receiver: {
        account_address: Address;
        business_data: {
            name: string;
            legal_name: string;
            address: string;
            city: string;
            country: string;
            line1: string;
            line2: string;
            postal_code: string;
            state: string;
        };
    };
    action: {
        amount: string;
        currency: StableToken;
        action: 'charge';
        timestamp: string;
    };
    reference_id: string;
    description: string;
}
