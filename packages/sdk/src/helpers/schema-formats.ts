import { FormatDefinition } from 'ajv';

export const formats: {
  [index: string]: FormatDefinition | undefined;
} = {
  hex: {
    type: 'string',
    validate: /(0[xX])*[0-9a-fA-F]+/,
    compare: (data1: string, data2: string) => {
      const num1 = Number(data1);
      const num2 = Number(data2);
      if (num1 < num2) return -1;
      if (num2 < num1) return 1;
      return 0;
    },
    async: false,
  },
  int32: {
    type: 'number',
    validate: (data) => !isNaN(data),
    async: false,
  },
};
