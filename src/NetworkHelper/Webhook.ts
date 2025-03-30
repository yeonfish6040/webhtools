import url from "node:url";
import * as http from "node:http";
import { Server } from "node:http";

import * as ngrok from "ngrok";
// @ts-ignore
import * as parseRequest from "parse-request";

import {Listener} from "./types";

export class Webhook {
  private readonly port: number;
  private readonly listeners: { [key: string]: Listener };

  private url = "";

  private server: Server;

  constructor(port: number) {
    this.port = port;
    this.listeners = {};

    this.onRequest = this.onRequest.bind(this);
    this.server = http.createServer(this.onRequest).listen(port);
  }

  onRequest(req: any, res: any) {
    const buff: any[] | Uint8Array<ArrayBufferLike> = [];
    req.on('data', (chunk: any) => {
      buff.push(chunk);
    });

    req.on("end", () => {
      const parsedUrl = url.parse(req.url);
      const path = parsedUrl.path || "";

      const headers = Object.fromEntries(
          req.rawHeaders.reduce((resultArray: string[][], item: string, index: number) => {
            const chunkIndex = Math.floor(index/2)

            if (!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = []
            }

            resultArray[chunkIndex].push(item)

            return resultArray
          }, [])
      );
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

  set(k: string, v: Listener) {
    this.listeners[k] = v;
  }

  remove(k: string) {
    delete this.listeners[k];
  }

  close() {
    this.server.close();
  }

  async publish(authtoken: string="") {
    try {
      if (authtoken)
        this.url = await ngrok.connect({ proto: "http", addr: this.port, authtoken });
      else
        this.url = await ngrok.connect({ proto: "http", addr: this.port });

      return this.url;
    }catch (e: any) {
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