import { ContentType, HttpHeader, HttpHeaderObject, HttpRequestBody, HttpRequestMethod, HttpResponse } from "./types";
export declare class RequestHelper {
    private BASE_URL;
    private CONTENT_TYPE;
    private AUTHORIZATION;
    private CUSTOM_HEADERS;
    constructor(baseURL: string);
    getBaseURL(): string;
    getContentType(): ContentType | string;
    getHeaders(): HttpHeaderObject;
    setBaseUrl(baseURL: string): RequestHelper;
    setContentType(contentType: ContentType | string): RequestHelper;
    addHeader(key: HttpHeader, value: string): RequestHelper;
    delHeader(key: HttpHeader): RequestHelper;
    setHeader(obj: HttpHeaderObject): RequestHelper;
    resetHeader(): RequestHelper;
    sendRequest<t>(method: HttpRequestMethod | string, path: string, body?: HttpRequestBody | string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>>;
    get<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>>;
    post<t>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>>;
    put<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>>;
    patch<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>>;
    delete<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>>;
}
