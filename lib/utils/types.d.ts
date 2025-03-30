export declare const ConfigKeyValues: readonly ["user", "sessionId", "csrfToken"];
export type ConfigKey = (typeof ConfigKeyValues)[number];
export type Config = {
    [key in ConfigKey | string]: any;
};
