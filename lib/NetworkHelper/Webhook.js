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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const node_url_1 = __importDefault(require("node:url"));
const http = __importStar(require("node:http"));
const ngrok = __importStar(require("ngrok"));
class Webhook {
    port;
    listeners;
    url = "";
    server;
    constructor(port) {
        this.port = port;
        this.listeners = {};
        this.onRequest = this.onRequest.bind(this);
        this.server = http.createServer(this.onRequest).listen(port);
    }
    onRequest(req, res) {
        const buff = [];
        req.on('data', (chunk) => {
            buff.push(chunk);
        });
        req.on("end", () => {
            const parsedUrl = node_url_1.default.parse(req.url);
            const path = parsedUrl.path || "";
            const headers = Object.fromEntries(req.rawHeaders.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / 2);
                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [];
                }
                resultArray[chunkIndex].push(item);
                return resultArray;
            }, []));
            const withBody = { ...req, body: Buffer.concat(buff), headers: headers };
            let status;
            if (this.listeners[path])
                status = this.listeners[path](withBody);
            if (isNaN(status))
                res.writeHead(200);
            else
                res.writeHead(status);
            res.end();
        });
    }
    set(k, v) {
        this.listeners[k] = v;
    }
    remove(k) {
        delete this.listeners[k];
    }
    close() {
        this.server.close();
    }
    async publish(authtoken = "") {
        try {
            if (authtoken)
                this.url = await ngrok.connect({ proto: "http", addr: this.port, authtoken });
            else
                this.url = await ngrok.connect({ proto: "http", addr: this.port });
            return this.url;
        }
        catch (e) {
            if (e.message === "connect ECONNREFUSED 127.0.0.1:4040")
                throw new Error("Cannot connect to Ngrok. Is Ngrok agent installed and running on the background?");
            throw new Error(e);
        }
    }
    async disconnect() {
        if (this.url)
            await ngrok.disconnect(this.url);
        else
            await ngrok.disconnect();
    }
}
exports.Webhook = Webhook;
