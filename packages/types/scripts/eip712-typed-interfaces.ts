export {
  EIP712ObjectValue,
  EIP712Parameter,
  EIP712TypedData,
  EIP712Types,
} from "@celo/utils/lib/sign-typed-data-utils";

import { EIP712Parameter } from "@celo/utils/lib/sign-typed-data-utils";

// Temporary solution (definitions aren't exposed yet) - copy definitions from @celo/utils/lib/sign-typed-data-utils
export interface EIP712TypeDefinition {
  name: string;
  schema: EIP712Parameter[];
  bigNumbers: string[];
}
export interface EIP712TypeDefinitions {
  [key: string]: EIP712TypeDefinition;
}
