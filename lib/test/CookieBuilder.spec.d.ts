import { Tester } from "./types";
export declare class CookieBuilderSpec implements Tester {
    name: string;
    expected: string;
    run(): Promise<any>;
}
