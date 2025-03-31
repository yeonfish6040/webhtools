export declare const ConfigKeyValues: readonly ["user", "sessionId", "csrfToken"];
export type ConfigKey = (typeof ConfigKeyValues)[number];
export type Config = {
    [key in ConfigKey | string]: any;
};
export type JWTHeader = {
    [key: string]: string;
};
export type JWTBody = {
    [key: string]: any;
};
