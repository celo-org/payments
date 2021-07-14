/**
 * Mock storage layer for the Celo Payments server.
 */

import { Simple, KYC } from "./items";

const keys = {
  SIMPLE: "00000000-0000-0000-0000000000",
  KYC: "00000000-0000-0000-0000000001",
};

const database = {
  "00000000-0000-0000-0000000000": Simple,
  "00000000-0000-0000-0000000001": KYC,
  "00000000-0000-0000-0000000002": {},

  "00000000-0000-0000-0000000099": {},
};

export const get = (id: string) => {
  return database[id] || database[keys[id]];
};

export const has = (id: string) => {
  return !!get(id);
};

/**
 * Simple in memory update, will be lost when the server
 * restarts
 */
export const update = (id: string, newItem: any) => {
  database[id] = newItem;
};
