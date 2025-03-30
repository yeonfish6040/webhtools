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
const read_1 = require("read");
const base85 = __importStar(require("base85"));
const RequestHelper_1 = require("../RequestHelper");
const config_1 = require("../utils/config");
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
        this.rh.setContentType("application/json");
        this.config = new config_1.ConfigManager();
    }
    async init() {
        this.isInitCalled = true;
        let isLogined = await this.checkLogin();
        while (!isLogined) {
            const credential = await this.askCredential();
            this.config.set("user", this.encodeBase85(`${credential.email}:${credential.password}`));
            isLogined = await this.checkLogin();
        }
        this.rh.setCookie("sessionid", this.config.get("sessionId"));
        this.rh.setCookie("csrf_token", this.config.get("csrfToken"));
        this.rh.addHeader("X-CSRFTOKEN", this.config.get("csrfToken"));
        this.rh.addHeader("Referer", `https://dreamhack.io/wargame/challenges/${this.problemId}`);
        this.rh.addHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0");
        return this;
    }
    async openVM(wait_for_init = true) {
        await this.checkInit();
        if (this.recursionProtect > 2) {
            this.recursionProtect = 0;
            return undefined;
        }
        const res = await this.rh.get("/live");
        if (res.json && res.json.id) {
            this.vmHost = res.json.host;
            this.vmPort = res.json.port_mappings[0][1];
        }
        else {
            const res1 = await this.rh.post("/live/");
            if (res1.status !== 201)
                throw Error("Cannot open vm");
            let vmOpened = false;
            while (!vmOpened) {
                const res2 = await this.rh.get("/live");
                if (res2.json && res2.json.id)
                    vmOpened = true;
                this.sleep(2000);
            }
            this.recursionProtect++;
            await this.openVM();
        }
        if (wait_for_init) {
            let vmOpened = false;
            while (!vmOpened) {
                try {
                    await fetch(this.getURL());
                    vmOpened = true;
                }
                catch (e) { }
            }
        }
        return this.getURL();
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
    async sendFlag(flag) {
        await this.checkInit();
        const data = await this.rh.post("/auth/", { flag: flag });
        if (data.ok)
            return "Success";
        else if (data.json.flag[0] === "유저가 이미 인증되었습니다.")
            return "Already";
        else
            return "Fail";
    }
    async checkLogin() {
        await this.checkInit();
        if (this.config.get("csrfToken") && this.config.get("csrfToken")) {
            const res = await fetch("https://dreamhack.io/login", { headers: { "Cookie": `sessionid=${this.config.get("sessionId")}` } });
            if ((await res.text()).indexOf(" <div class=\"email\" ") !== -1)
                return true;
        }
        if (this.config.get("user")) {
            const [email, password] = this.decodeBase85(this.config.get("user")).split(":");
            const res = await fetch("https://dreamhack.io/api/v1/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, saveLogin: true }),
            });
            if (res.ok) {
                const sessionId = res.headers.getSetCookie().find((e) => e.startsWith("sessionid")).split(";")[0].split("=")[1];
                const csrfToken = res.headers.getSetCookie().find((e) => e.startsWith("csrf_token")).split(";")[0].split("=")[1];
                this.config.set("sessionId", sessionId);
                this.config.set("csrfToken", csrfToken);
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
    async checkInit() {
        if (!this.isInitCalled || !this.config)
            await this.init();
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
