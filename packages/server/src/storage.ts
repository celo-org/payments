/**
 * Mock storage layer for the Celo Payments server.
 */

const database = {
  "00000000-0000-0000-0000000000": {},
  "00000000-0000-0000-0000000001": {},
  "00000000-0000-0000-0000000002": {},

  "00000000-0000-0000-0000000099": {},
};

export const get = (id: string) => {
  return database[id];
};

export const has = (id: string) => {
  return !!database[id];
};
