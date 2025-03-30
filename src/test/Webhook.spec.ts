import {Tester} from "./types";
import {Webhook} from "../NetworkHelper";

export class WebhookSpec implements Tester {
  name = "WebhookSpec"
  expected = "hello";

  async run() {
    const webhook = new Webhook(8000);
    const url = await webhook.publish();

    return await new Promise((resolve) => {
      webhook.set("/test", (req) => {
        webhook.disconnect();
        resolve(req.body.toString());
      })

      fetch(`${url}/test`, { method: "POST", body: "hello" });
    })
  }
}