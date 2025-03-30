import { Listener } from "./types";
export declare class Webhook {
    private readonly port;
    private readonly listeners;
    private url;
    private server;
    constructor(port: number);
    onRequest(req: any, res: any): void;
    set(k: string, v: Listener): void;
    remove(k: string): void;
    close(): void;
    publish(authtoken?: string): Promise<string>;
    disconnect(): Promise<void>;
}
