import {
  ContentType,
  HttpAuthorize,
  HttpHeader,
  HttpHeaderObject,
  HttpRequestBody,
  HttpRequestMethod,
  HttpResponse
} from "./types";

export class RequestHelper {
  private BASE_URL: string;

  private CONTENT_TYPE: ContentType | string;
  private AUTHORIZATION: HttpAuthorize | null;

  private CUSTOM_HEADERS: Headers;

  constructor(baseURL: string) {
    this.BASE_URL = baseURL;

    this.CONTENT_TYPE = "";
    this.AUTHORIZATION = null;

    this.CUSTOM_HEADERS = new Headers();
  }

  // GETTER ===============================================================================
  getBaseURL(): string {
    return this.BASE_URL;
  }

  getContentType(): ContentType | string {
    return this.CONTENT_TYPE;
  }

  getHeaders(): HttpHeaderObject {
    return Object.fromEntries([...this.CUSTOM_HEADERS]);
  }

  // SETTER ===============================================================================
  setBaseUrl(baseURL: string): RequestHelper  {
    this.BASE_URL = baseURL;
    return this;
  }

  setContentType(contentType: ContentType | string): RequestHelper {
    this.CONTENT_TYPE = contentType;
    return this;
  }

  addHeader(key: HttpHeader, value: string): RequestHelper {
    this.CUSTOM_HEADERS.set(key, value);
    return this;
  }

  delHeader(key: HttpHeader): RequestHelper {
    this.CUSTOM_HEADERS.delete(key);
    return this;
  }

  setHeader(obj: HttpHeaderObject): RequestHelper {
    this.CUSTOM_HEADERS = new Headers(obj);
    return this;
  }

  resetHeader(): RequestHelper {
    this.CUSTOM_HEADERS = new Headers();
    return this;
  }

  // EXECUTES =============================================================================
  async sendRequest<t>(method: HttpRequestMethod | string, path: string, body?: HttpRequestBody | string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>> {
    const url = `${this.BASE_URL.endsWith("/") ? this.BASE_URL.substring(0, this.BASE_URL.length-1) : this.BASE_URL}/${path.startsWith("/") ? path.substring(1, path.length) : path}`;

    const requestContentType: ContentType | string = this.CONTENT_TYPE ? this.CONTENT_TYPE : "application/json";

    // merge fixed headers(permanent header) and specific headers(one-time header)
    const requestHeader = new Headers(this.getHeaders());
    requestHeader.set("Content-Type", requestContentType);
    if (customHeader) {
      Object.entries(customHeader).forEach(([k, v]) => {
        requestHeader.set(k, v);
      });
    }

    let requestBody = "";
    if (typeof body !== "string") {

    }

    const res = await fetch(url, {
      method,
      cache: "no-cache",
      headers: requestHeader,
      body: requestBody ? requestBody : undefined,
    });

    let bytes: Uint8Array | null;
    let text: string | null;
    let json: t | null;
    let formData: FormData | null;
    try { bytes = await res.bytes(); } catch (e) { bytes = null }
    try { if (bytes !== null) text = new TextDecoder().decode(bytes); else throw Error() } catch (e) { text = null }
    try { if (text !== null) json = JSON.parse(text) as t; else throw Error() } catch (e) { json = null }
    try { if (json !== null) { formData = new FormData(); Object.entries(json as JSON).forEach(([k, v]) => formData?.append(k, v)) } else throw Error() } catch (e) { formData = null }

    return {
      ok: res.ok,
      url: res.url,
      headers: res.headers,
      status: res.status,
      statusText: res.statusText,
      bytes,
      text,
      json,
      formData,
    }
  }

  async get<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>> {
    return await this.sendRequest<t>("GET", path, undefined, customHeader);
  }

  async post<t>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>> {
    return await this.sendRequest<t>("GET", path, body, customHeader);
  }

  async put<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>> {
    return await this.sendRequest<t>("PUT", path, undefined, customHeader);
  }

  async patch<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>> {
    return await this.sendRequest<t>("PATCH", path, undefined, customHeader);
  }

  async delete<t>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t | any>> {
    return await this.sendRequest<t>("DELETE", path, undefined, customHeader);
  }
}