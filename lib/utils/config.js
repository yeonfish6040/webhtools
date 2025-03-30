"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
class ConfigManager {
    config;
    constructor() {
        this.config = {};
        this.fetchConfig();
    }
    getConfig() {
        return this.config;
    }
    get(key) {
        return this.config[key];
    }
    set(key, value) {
        this.config[key] = value;
        const configPath = path_1.default.join(os_1.default.homedir(), ".webhtools");
        fs_1.default.writeFileSync(configPath, JSON.stringify(this.config));
        this.fetchConfig();
    }
    fetchConfig() {
        const configPath = path_1.default.join(os_1.default.homedir(), ".webhtools");
        const isConfigFileExists = fs_1.default.existsSync(configPath);
        if (isConfigFileExists) {
            try {
                JSON.parse(fs_1.default.readFileSync(configPath).toString());
            }
            catch (e) {
                fs_1.default.writeFileSync(configPath, "{}");
            }
        }
        else {
            fs_1.default.writeFileSync(configPath, "{}");
        }
        this.config = JSON.parse(fs_1.default.readFileSync(configPath).toString());
    }
}
exports.ConfigManager = ConfigManager;
