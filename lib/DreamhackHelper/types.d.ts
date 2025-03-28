export interface GetDreamhackContainerOptions {
    https: boolean;
    tcp: boolean;
    user: string;
}
export interface User {
    email: string;
    password: string;
}
export declare const FlagResultValues: readonly ["Success", "Fail", "Already"];
export type FlagResult = (typeof FlagResultValues)[number];
