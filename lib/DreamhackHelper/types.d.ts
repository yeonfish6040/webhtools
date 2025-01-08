export interface GetDreamhackContainerOptions {
    https: boolean;
    tcp: boolean;
    user: string;
}
export interface User {
    email: string;
    password: string;
}
export declare const ConfigKeyValues: readonly ["user", "sessionId", "csrfToken"];
export type ConfigKey = (typeof ConfigKeyValues)[number];
export type Config = {
    [key in ConfigKey | string]: any;
};
