"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHelper = void 0;
class RequestHelper {
    BASE_URL;
    CONTENT_TYPE;
    AUTHORIZATION;
    CUSTOM_HEADERS;
    constructor(baseURL) {
        this.BASE_URL = baseURL;
        this.CONTENT_TYPE = "";
        this.AUTHORIZATION = null;
        this.CUSTOM_HEADERS = new Headers();
    }
    // GETTER ===============================================================================
    getBaseURL() {
        return this.BASE_URL;
    }
    getContentType() {
        return this.CONTENT_TYPE;
    }
    getHeaders() {
        return Object.fromEntries([...this.CUSTOM_HEADERS]);
    }
    // SETTER ===============================================================================
    setBaseUrl(baseURL) {
        this.BASE_URL = baseURL;
        return this;
    }
    setContentType(contentType) {
        this.CONTENT_TYPE = contentType;
        return this;
    }
    addHeader(key, value) {
        this.CUSTOM_HEADERS.set(key, value);
        return this;
    }
    delHeader(key) {
        this.CUSTOM_HEADERS.delete(key);
        return this;
    }
    setHeader(obj) {
        this.CUSTOM_HEADERS = new Headers(obj);
        return this;
    }
    resetHeader() {
        this.CUSTOM_HEADERS = new Headers();
        return this;
    }
    // EXECUTES =============================================================================
    async sendRequest(method, path, body, customHeader) {
        const url = `${this.BASE_URL.endsWith("/") ? this.BASE_URL.substring(0, this.BASE_URL.length - 1) : this.BASE_URL}/${path.startsWith("/") ? path.substring(1, path.length) : path}`;
        const requestContentType = this.CONTENT_TYPE ? this.CONTENT_TYPE : "application/json";
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
        let bytes;
        let text;
        let json;
        let formData;
        try {
            bytes = await res.bytes();
        }
        catch (e) {
            bytes = null;
        }
        try {
            if (bytes !== null)
                text = new TextDecoder().decode(bytes);
            else
                throw Error();
        }
        catch (e) {
            text = null;
        }
        try {
            if (text !== null)
                json = JSON.parse(text);
            else
                throw Error();
        }
        catch (e) {
            json = null;
        }
        try {
            if (json !== null) {
                formData = new FormData();
                Object.entries(json).forEach(([k, v]) => formData?.append(k, v));
            }
            else
                throw Error();
        }
        catch (e) {
            formData = null;
        }
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
        };
    }
    async get(path, customHeader) {
        return await this.sendRequest("GET", path, undefined, customHeader);
    }
    async post(path, body, customHeader) {
        return await this.sendRequest("GET", path, body, customHeader);
    }
    async put(path, customHeader) {
        return await this.sendRequest("PUT", path, undefined, customHeader);
    }
    async patch(path, customHeader) {
        return await this.sendRequest("PATCH", path, undefined, customHeader);
    }
    async delete(path, customHeader) {
        return await this.sendRequest("DELETE", path, undefined, customHeader);
    }
}
exports.RequestHelper = RequestHelper;
