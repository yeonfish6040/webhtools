export interface GetDreamhackContainerOptions {
  https: boolean,
  tcp: boolean,
  user: string
}

export interface User {
  email: string;
  password: string;
}

export const FlagResultValues = ["Success", "Fail", "Already"] as const;
export type FlagResult = (typeof FlagResultValues)[number];