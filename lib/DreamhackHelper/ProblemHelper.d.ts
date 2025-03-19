export declare class ProblemHelper {
    private recursionProtect;
    private isInitCalled;
    private readonly problemId;
    private config;
    private rh;
    private vmHost;
    private vmPort;
    private vmTerminateTime;
    constructor(problemId: number);
    init(): Promise<ProblemHelper>;
    openVM(wait_for_init?: boolean): Promise<ProblemHelper>;
    getURL(): string | undefined;
    getHost(): string | undefined;
    getPort(): string | undefined;
    closeVM(): Promise<ProblemHelper>;
    private fetchConfig;
    private setConfig;
    private checkLogin;
    private askCredential;
    private checkInit;
    private encodeBase85;
    private decodeBase85;
    private sleep;
}
