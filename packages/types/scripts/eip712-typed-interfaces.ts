// Temporary solution (definitions aren't exposed yet) - copy definitions from @celo/utils/lib/sign-typed-data-utils
export interface EIP712Parameter {
  name: string;
  type: string;
}
export interface EIP712Types {
  [key: string]: EIP712Parameter[];
}
export type EIP712ObjectValue = string | number | EIP712Object;
export interface EIP712Object {
  [key: string]: EIP712ObjectValue;
}
export interface EIP712TypedData {
  types: EIP712Types;
  domain: EIP712Object;
  message: EIP712Object;
  primaryType: string;
}
