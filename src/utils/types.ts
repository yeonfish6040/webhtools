export const ConfigKeyValues = ["user", "sessionId", "csrfToken"] as const;
export type ConfigKey = (typeof ConfigKeyValues)[number];
export type Config = { [key in ConfigKey | string]: any };