export interface Tester {
    name: string;
    expected: any;
    run(): Promise<any>;
}
