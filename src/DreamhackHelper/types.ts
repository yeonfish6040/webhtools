export interface GetDreamhackContainerOptions {
  https: boolean,
  tcp: boolean,
  user: string
}

export interface User {
  email: string;
  password: string;
}

export const ConfigKeyValues = ["user", "sessionId", "csrfToken"] as const;
export type ConfigKey = (typeof ConfigKeyValues)[number];
export type Config = { [key in ConfigKey | string]: any };

export const FlagResultValues = ["Success", "Fail", "Already"] as const;
export type FlagResult = (typeof FlagResultValues)[number];