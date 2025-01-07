import { Tester } from "./types";
export declare class ProblemHelperSpec implements Tester {
    name: string;
    expected: string;
    run(): Promise<any>;
}
