import {
  ContentType,
  HttpAuthorize, HttpAuthorizeSchema,
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

  getAuth(): HttpAuthorize | null {
    return this.AUTHORIZATION;
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

  setAuth(schema: HttpAuthorizeSchema, value: string): RequestHelper {
    this.AUTHORIZATION = {
      schema,
      value
    }
    return this;
  }

  setBasicAuth(username: string, password: string): RequestHelper {
    const authString = Buffer.from(`${username}:${password}`).toString("base64");
    this.AUTHORIZATION = {
      schema: "Basic",
      value: authString,
    }
    return this;
  }

  setBearerAuth(token: string) {
    this.AUTHORIZATION = {
      schema: "Bearer",
      value: token,
    }
  }

  resetAuth(): RequestHelper {
    this.AUTHORIZATION = null;
    return this;
  }

  // EXECUTES =============================================================================
  async sendRequest<t = any>(method: HttpRequestMethod | string, path: string, body?: HttpRequestBody | string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>> {
    // build url
    let url = `${this.BASE_URL.endsWith("/") ? this.BASE_URL.substring(0, this.BASE_URL.length-1) : this.BASE_URL}/${path.startsWith("/") ? path.substring(1, path.length) : path}`;
    if (url.endsWith("/")) url = url.substring(0, url.length-1);

    const requestContentType: ContentType | string = this.CONTENT_TYPE ? this.CONTENT_TYPE : "application/json";

    // header priority (one-time > custom setters(auth, content-type..) > fixed headers)
    // merge fixed headers(permanent header) and specific headers(one-time header)
    const requestHeader = new Headers(this.getHeaders());
    requestHeader.set("Content-Type", requestContentType);
    if (this.AUTHORIZATION)
      requestHeader.set("Authorization", `${this.AUTHORIZATION.schema} ${this.AUTHORIZATION.value}`);
    if (customHeader) {
      Object.entries(customHeader).forEach(([k, v]) => {
        requestHeader.set(k, v);
      });
    }

    let requestBody = "";
    if (body && typeof body !== "string") {
      switch (requestContentType) {
        case "application/json":
          requestBody = JSON.stringify(body);
          break;
        case "application/x-www-form-urlencoded":
          requestBody = Object.entries(body).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
          break;
        default:
          requestBody = body.toString();
      }
    }else if (body) requestBody = body;

    const res = await fetch(url, {
      method,
      headers: requestHeader,
      body: requestBody ? requestBody : undefined,
      cache: "no-cache"
    });

    let bytes: Uint8Array | null;
    let text: string | null;
    let json: t | null;
    let formData: FormData | null;
    const formRegex = /((?<group>(?<key>[^=&]+)=(?<value>[^=&]+))&?)/g
    try { bytes = await res.bytes(); } catch (e) { bytes = null }
    try { if (bytes !== null) text = new TextDecoder().decode(bytes); else throw Error() } catch (e) { text = null }
    try { if (text !== null) json = JSON.parse(text) as t;            else throw Error() } catch (e) { json = null }
    try { if (text !== null && formRegex.test(text)) {
      formData = Object.fromEntries(text.split("&").map((e) => e.split("=")));
    } else throw Error(); } catch (e) { formData = null }

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

  async get<t = any>(path: string, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>> {
    return await this.sendRequest<t>("GET", path, undefined, customHeader);
  }

  async post<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>> {
    return await this.sendRequest<t>("POST", path, body, customHeader);
  }

  async put<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>> {
    return await this.sendRequest<t>("PUT", path, body, customHeader);
  }

  async patch<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>> {
    return await this.sendRequest<t>("PATCH", path, body, customHeader);
  }

  async delete<t = any>(path: string, body?: HttpRequestBody, customHeader?: HttpHeaderObject | null): Promise<HttpResponse<t>> {
    return await this.sendRequest<t>("DELETE", path, body, customHeader);
  }
}