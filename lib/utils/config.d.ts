import { Config, ConfigKey } from "./types";
export declare class ConfigManager {
    private config;
    constructor();
    getConfig(): Config;
    get(key: string): any;
    set(key: ConfigKey | string, value: any): void;
    private fetchConfig;
}
