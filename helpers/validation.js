import { EMAIL_REGEX } from "../constants/default";

export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};
