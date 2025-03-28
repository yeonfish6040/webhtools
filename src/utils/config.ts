import path from "path";
import os from "os";
import fs from "fs";
import {Config, ConfigKey} from "./types";

export class ConfigManager {
  private config: Config;

  constructor() {
    this.config = {};

    this.fetchConfig();
  }

  getConfig() {
    return this.config;
  }

  get(key: string) {
    return this.config[key];
  }

  set(key: ConfigKey | string, value: any) {
    this.config[key] = value;

    const configPath = path.join(os.homedir(), ".webhtools");
    fs.writeFileSync(configPath, JSON.stringify(this.config));
    this.fetchConfig();
  }

  private fetchConfig() {
    const configPath = path.join(os.homedir(), ".webhtools");
    const isConfigFileExists = fs.existsSync(configPath);
    if (isConfigFileExists) {
      try {
        JSON.parse(fs.readFileSync(configPath).toString());
      } catch (e) {
        fs.writeFileSync(configPath, "{}");
      }
    }else {
      fs.writeFileSync(configPath, "{}");
    }

    this.config = JSON.parse(fs.readFileSync(configPath).toString());
  }
}