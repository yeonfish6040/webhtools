import { ContentType, HttpAuthorize, HttpAuthorizeSchema, HttpCookie, HttpHeader, HttpHeaderObject, HttpRequestBody, HttpRequestMethod, HttpResponse } from "./types";
import { ProblemHelper } from "../DreamhackHelper";
export declare class RequestHelper {
    private BASE_URL;
    private CONTENT_TYPE;
    private AUTHORIZATION;
    private COOKIE;
    private CUSTOM_HEADERS;
    problemHelper: ProblemHelper | undefined;
    constructor(baseURL: string);
    getBaseURL(): string;
    getContentType(): ContentType | string;
    getHeaders(): HttpHeaderObject;
    getAuth(): HttpAuthorize | null;
    getCookie(): HttpCookie;
    setBaseUrl(baseURL: string): RequestHelper;
    setContentType(contentType: ContentType | string): RequestHelper;
    addHeader(key: HttpHeader | string, value: string): RequestHelper;
    delHeader(key: HttpHeader): RequestHelper;
    setHeader(obj: HttpHeaderObject): RequestHelper;
    resetHeader(): RequestHelper;
    setAuth(schema: HttpAuthorizeSchema, value: string): RequestHelper;
    setBasicAuth(username: string, password: string): RequestHelper;
    setBearerAuth(token: string): void;
    setTokenAuth(token: string): void;
    resetAuth(): RequestHelper;
    setCookie(key: string, value: string): RequestHelper;
    delCookie(key: string): RequestHelper;
    resetCookie(): RequestHelper;
    sendRequest<t = any>(method: HttpRequestMethod | string, path: string, body?: HttpRequestBody | string, customHeader?: HttpHeaderObject | null, outputFile?: string): Promise<HttpResponse<t>>;
    get<t = any>(path: string, customHeader?: HttpHeaderObject | null, outputFile?: string): Promise<HttpResponse<t>>;
    post<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    ihatepost(url: string, option: RequestInit): Promise<Response>;
    put<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    patch<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    delete<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    setProblemHelper(problemHelper: ProblemHelper): Promise<this>;
    /** from dreamhack problem. */
    static from(problemId: number): Promise<RequestHelper>;
}
