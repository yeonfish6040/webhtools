import { Tester } from "./types";
export declare class WebhookSpec implements Tester {
    name: string;
    expected: string;
    run(): Promise<unknown>;
}
