import { customAlphabet } from "nanoid";

// custom id 5 character
export const getId = (): string => {
  const nanoid = customAlphabet("ABCDEVGHIJKLMNOPQRSTUVWXYZ0123456789", 10);
  return nanoid(5);
};
