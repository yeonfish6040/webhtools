import { JWTBody, JWTHeader } from "./types";
export declare const JWT: (header: JWTHeader, body: JWTBody, key?: string) => string;
