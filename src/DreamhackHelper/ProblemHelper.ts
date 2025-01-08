import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import {read} from "read";

import * as base85 from "base85";

import {Config, ConfigKey, User} from "./types";
import {RequestHelper} from "../RequestHelper";

export class ProblemHelper {
  private recursionProtect: number;
  private isInitCalled: boolean;

  private readonly problemId: number;
  private config: Config | undefined;

  private rh: RequestHelper;

  private vmHost: string | undefined;
  private vmPort: string | undefined;
  private vmTerminateTime: string | undefined;


  constructor(problemId: number) {
    this.problemId = problemId;
    this.isInitCalled = false;
    this.recursionProtect = 0;

    this.rh = new RequestHelper(`https://dreamhack.io/api/v1/wargame/challenges/${this.problemId}/`);
  }

  async init(): Promise<ProblemHelper> {
    this.isInitCalled = true;

    this.fetchConfig();

    let isLogined = await this.checkLogin();
    while (!isLogined) {
      const credential = await this.askCredential();
      this.setConfig("user", this.encodeBase85(`${credential.email}:${credential.password}`));

      isLogined = await this.checkLogin();
    }
    this.rh.setCookie("sessionid", this.config!.sessionId);
    this.rh.setCookie("csrf_token", this.config!.csrfToken);
    this.rh.addHeader("X-CSRFTOKEN", this.config!.csrfToken)
    this.rh.addHeader("Referer", `https://dreamhack.io/wargame/challenges/${this.problemId}`);
    this.rh.addHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0");

    return this;
  }

  async openVM(): Promise<ProblemHelper> {
    if (this.recursionProtect > 2) {
      this.recursionProtect = 0;
      return this;
    }
    const res = await this.rh.get("/live");
    if (res.json && res.json.id) {
      this.vmHost = res.json.host;
      this.vmPort = res.json.port_mappings[0][1];
    }else {
      const res1 = await this.rh.sendRequest("POST", "/live");
      console.log(res1)
      if (res1.status !== 201) throw Error("Cannot open vm");
      console.log("waiting for vm open...");

      let vmOpened = false;
      while (!vmOpened) {
        const res2 = await this.rh.get("/live");
        if (res2.json && res2.json.id) vmOpened = true;
        this.sleep(2000);
      }
      console.log("vm opened.");

      this.recursionProtect++;
      await this.openVM();
    }
    return this;
  }

  getURL(): string | undefined {
    if (!this.vmHost || !this.vmPort) return undefined;
    return `http://${this.vmHost}:${this.vmPort}/`;
  }

  getHost(): string | undefined {
    return this.vmHost;
  }

  getPort(): string | undefined {
    return this.vmPort;
  }

  async closeVM(): Promise<ProblemHelper> {
    this.vmHost = undefined;
    this.vmPort = undefined;
    await this.rh.delete("/live");
    return this;
  }

  private fetchConfig(): void {
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

  private setConfig(key: ConfigKey | string, value: any) {
    this.checkInit();

    this.config![key] = value;

    const configPath = path.join(os.homedir(), ".webhtools");
    fs.writeFileSync(configPath, JSON.stringify(this.config));
    this.fetchConfig();
  }

  private async checkLogin() {
    this.checkInit();

    if (this.config!.sessionId && this.config!.csrfToken) {
      const res = await fetch("https://dreamhack.io/login", { headers: { "Cookie": `sessionid=${this.config!.sessionId}` } });

      if ((await res.text()).indexOf(" <div class=\"email\" ") !== -1)
        return true;
    }
    if (this.config!.user) {
      const [email, password] = this.decodeBase85(this.config!.user).split(":");
      const res = await fetch("https://dreamhack.io/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, saveLogin: true }),
      });

      if (res.ok) {
        const sessionId = res.headers.getSetCookie().find((e) => e.startsWith("sessionid"))!.split(";")[0].split("=")[1];
        const csrfToken = res.headers.getSetCookie().find((e) => e.startsWith("csrf_token"))!.split(";")[0].split("=")[1];
        this.setConfig("sessionId", sessionId);
        this.setConfig("csrfToken", csrfToken);

        return true;
      }
    }
    return false;
  }

  private async askCredential(): Promise<User> {
    const email = await read({ prompt: "dreamhack email: " });
    const password = await read({
      prompt: "dreamhack password: ",
      silent: true,
      replace: "*"
    });

    return { email, password };
  }

  private checkInit() {
    if (!this.isInitCalled || !this.config) throw new Error("This class cannot be used without init()");
  }

  private encodeBase85(str: string): string {
    return base85.encode(str, "ascii85");
  }

  private decodeBase85(str: string): string {
    const decoded = base85.decode(str, "ascii85");
    if (decoded === false)
      throw Error("Cannot decode base85 string");
    return new TextDecoder().decode(decoded);
  }

  private sleep(ms: number) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }

  // https://dreamhack.io/api/v1/wargame/challenges/1671/live/ (GET, POST, DELETE)
  // async getURL
}