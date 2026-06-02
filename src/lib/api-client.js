// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
class ApiClient {

    /**
     * @typedef {Object} Oauth
     *   @property {function(): Promise<string>} getToken
     */

    /**
     * @typedef {Object} ApiClientConfig
     *   @property {string} baseUrl
     *   @property {number} [timeoutInterval]
     *   @property {Record<string, string>} [headers] 
     */

    /**
     * @param {ApiClientConfig} config
     * @param {Oauth} oauth
     */
    constructor({ baseUrl, timeoutInterval = 30, headers = {}}, oauth) {
        this.baseUrl = baseUrl;
        this.timeoutInterval = timeoutInterval;
        this.headers = headers;
        this.oauth = oauth;
    };    

    /**
     * @param {string} endpoint 
     * @param {Object} [params] 
     * @returns 
     */
    async get(endpoint, params = {}) {
        const url = this._buildUrl(endpoint, params);
        const req = await this._buildRequest(url, "GET");
        return await this._handleResponse(req);
    }
    
    async put(endpoint, params = {}) {
        const url = this._buildUrl(endpoint, params);
        console.log(url)
        const req = await this._buildRequest(url, "PUT");
        return await this._handleResponse(req);
    }

    /**
     * @param {string} endpoint 
     * @param {Object} [body]
     * @param {Object} [params]
     * @returns 
     */
    async post(endpoint, body = {}, params = {}) {
        const url = this._buildUrl(endpoint, params);
        const req = await this._buildRequest(url, "POST");
        
        req.headers["Content-Type"] = "application/json";
        req.body = JSON.stringify(body);

        return await this._handleResponse(req);
    }

    async _buildRequest(url, method) {
        const token = await this.oauth.getToken();
        const req = new Request(url);
        req.method = method;
        
        req.headers = { 
            ...this.headers,
            "Authorization": `Bearer ${token}`,
        };
        
        req.timeoutInterval = this.timeoutInterval;
        
        return req;
    }

    async _handleResponse(req) {
        const res = await req.loadString();
        const status = req.response.statusCode;
        
        console.log(
            `${req.method}    ${req.url}    ${status}`
        );
        
        if (status === 401) {
            this.oauth.clearTokens();
            throw new Error("Unauthorized — token may be expired");
        };
        if (status >= 400) throw new Error(`HTTP ${status}: ${JSON.stringify(res)}`);
        
        return res
            ? JSON.parse(res)
            : null;
    }
    
    /**
     * @param {string} endpoint 
     * @param {Object} params 
     * @returns 
     */
    _buildUrl(endpoint, params = {}) {
        const path = endpoint.startsWith("http")
            ? endpoint
            : `${this.baseUrl}${endpoint}`;
        const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
        
        return queryString
            ? `${path}?${queryString}`
            : path;
    }
}

module.exports = ApiClient;