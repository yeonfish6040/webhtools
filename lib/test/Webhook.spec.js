"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookSpec = void 0;
const NetworkHelper_1 = require("../NetworkHelper");
class WebhookSpec {
    name = "WebhookSpec";
    expected = "hello";
    async run() {
        const webhook = new NetworkHelper_1.Webhook(8000);
        const url = await webhook.publish();
        return await new Promise((resolve) => {
            webhook.set("/test", (req) => {
                webhook.disconnect();
                resolve(req.body.toString());
            });
            fetch(`${url}/test`, { method: "POST", body: "hello" });
        });
    }
}
exports.WebhookSpec = WebhookSpec;
