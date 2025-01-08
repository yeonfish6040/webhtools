"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemHelper = void 0;
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const read_1 = require("read");
const base85 = __importStar(require("base85"));
const RequestHelper_1 = require("../RequestHelper");
class ProblemHelper {
    recursionProtect;
    isInitCalled;
    problemId;
    config;
    rh;
    vmHost;
    vmPort;
    vmTerminateTime;
    constructor(problemId) {
        this.problemId = problemId;
        this.isInitCalled = false;
        this.recursionProtect = 0;
        this.rh = new RequestHelper_1.RequestHelper(`https://dreamhack.io/api/v1/wargame/challenges/${this.problemId}/`);
    }
    async init() {
        this.isInitCalled = true;
        this.fetchConfig();
        let isLogined = await this.checkLogin();
        while (!isLogined) {
            const credential = await this.askCredential();
            this.setConfig("user", this.encodeBase85(`${credential.email}:${credential.password}`));
            isLogined = await this.checkLogin();
        }
        this.rh.setCookie("sessionid", this.config.sessionId);
        this.rh.setCookie("csrf_token", this.config.csrfToken);
        this.rh.addHeader("X-CSRFTOKEN", this.config.csrfToken);
        this.rh.addHeader("Referer", `https://dreamhack.io/wargame/challenges/${this.problemId}`);
        this.rh.addHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0");
        return this;
    }
    async openVM() {
        if (this.recursionProtect > 2) {
            this.recursionProtect = 0;
            return this;
        }
        const res = await this.rh.get("/live");
        if (res.json && res.json.id) {
            this.vmHost = res.json.host;
            this.vmPort = res.json.port_mappings[0][1];
        }
        else {
            const res1 = await this.rh.post("/live/");
            console.log(res1);
            if (res1.status !== 201)
                throw Error("Cannot open vm");
            console.log("waiting for vm open...");
            let vmOpened = false;
            while (!vmOpened) {
                const res2 = await this.rh.get("/live");
                if (res2.json && res2.json.id)
                    vmOpened = true;
                this.sleep(2000);
            }
            console.log("vm opened.");
            this.recursionProtect++;
            await this.openVM();
        }
        return this;
    }
    getURL() {
        if (!this.vmHost || !this.vmPort)
            return undefined;
        return `http://${this.vmHost}:${this.vmPort}/`;
    }
    getHost() {
        return this.vmHost;
    }
    getPort() {
        return this.vmPort;
    }
    async closeVM() {
        this.vmHost = undefined;
        this.vmPort = undefined;
        await this.rh.delete("/live");
        return this;
    }
    fetchConfig() {
        const configPath = path.join(os.homedir(), ".webhtools");
        const isConfigFileExists = fs.existsSync(configPath);
        if (isConfigFileExists) {
            try {
                JSON.parse(fs.readFileSync(configPath).toString());
            }
            catch (e) {
                fs.writeFileSync(configPath, "{}");
            }
        }
        else {
            fs.writeFileSync(configPath, "{}");
        }
        this.config = JSON.parse(fs.readFileSync(configPath).toString());
    }
    setConfig(key, value) {
        this.checkInit();
        this.config[key] = value;
        const configPath = path.join(os.homedir(), ".webhtools");
        fs.writeFileSync(configPath, JSON.stringify(this.config));
        this.fetchConfig();
    }
    async checkLogin() {
        this.checkInit();
        if (this.config.sessionId && this.config.csrfToken) {
            const res = await fetch("https://dreamhack.io/login", { headers: { "Cookie": `sessionid=${this.config.sessionId}` } });
            if ((await res.text()).indexOf(" <div class=\"email\" ") !== -1)
                return true;
        }
        if (this.config.user) {
            const [email, password] = this.decodeBase85(this.config.user).split(":");
            const res = await fetch("https://dreamhack.io/api/v1/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, saveLogin: true }),
            });
            if (res.ok) {
                const sessionId = res.headers.getSetCookie().find((e) => e.startsWith("sessionid")).split(";")[0].split("=")[1];
                const csrfToken = res.headers.getSetCookie().find((e) => e.startsWith("csrf_token")).split(";")[0].split("=")[1];
                this.setConfig("sessionId", sessionId);
                this.setConfig("csrfToken", csrfToken);
                return true;
            }
        }
        return false;
    }
    async askCredential() {
        const email = await (0, read_1.read)({ prompt: "dreamhack email: " });
        const password = await (0, read_1.read)({
            prompt: "dreamhack password: ",
            silent: true,
            replace: "*"
        });
        return { email, password };
    }
    checkInit() {
        if (!this.isInitCalled || !this.config)
            throw new Error("This class cannot be used without init()");
    }
    encodeBase85(str) {
        return base85.encode(str, "ascii85");
    }
    decodeBase85(str) {
        const decoded = base85.decode(str, "ascii85");
        if (decoded === false)
            throw Error("Cannot decode base85 string");
        return new TextDecoder().decode(decoded);
    }
    sleep(ms) {
        const wakeUpTime = Date.now() + ms;
        while (Date.now() < wakeUpTime) { }
    }
}
exports.ProblemHelper = ProblemHelper;
