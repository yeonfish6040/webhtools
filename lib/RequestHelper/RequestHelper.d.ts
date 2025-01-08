import { ContentType, HttpAuthorize, HttpAuthorizeSchema, HttpHeader, HttpHeaderObject, HttpRequestBody, HttpRequestMethod, HttpResponse } from "./types";
export declare class RequestHelper {
    private BASE_URL;
    private CONTENT_TYPE;
    private AUTHORIZATION;
    private CUSTOM_HEADERS;
    constructor(baseURL: string);
    getBaseURL(): string;
    getContentType(): ContentType | string;
    getHeaders(): HttpHeaderObject;
    getAuth(): HttpAuthorize | null;
    setBaseUrl(baseURL: string): RequestHelper;
    setContentType(contentType: ContentType | string): RequestHelper;
    addHeader(key: HttpHeader, value: string): RequestHelper;
    delHeader(key: HttpHeader): RequestHelper;
    setHeader(obj: HttpHeaderObject): RequestHelper;
    resetHeader(): RequestHelper;
    setAuth(schema: HttpAuthorizeSchema, value: string): RequestHelper;
    setBasicAuth(username: string, password: string): RequestHelper;
    setBearerAuth(token: string): void;
    resetAuth(): RequestHelper;
    sendRequest<t = any>(method: HttpRequestMethod | string, path: string, body?: HttpRequestBody | string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    get<t = any>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    post<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    put<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    patch<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    delete<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
}
