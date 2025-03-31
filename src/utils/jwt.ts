import * as crypto from "crypto";

import {JWTBody, JWTHeader} from "./types";

// export const JWT = (header: JWTHeader, body: JWTBody, key: string = "") => {
export const JWT = (header, body, key = "") => {
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const bodyBase64 = Buffer.from(JSON.stringify(body)).toString("base64url");
  const withoutHash = `${headerBase64}.${bodyBase64}`;
  const hash = crypto.createHmac("sha256", key).update(withoutHash).digest("base64url");

  return `${withoutHash}.${hash}`
}