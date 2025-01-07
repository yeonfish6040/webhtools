export interface Tester {
  name: string;
  expected: any;
  // @ts-ignore
  run(): Promise<any>;
}