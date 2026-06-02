// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
class ApiClient {

    /** 
     * @typedef {import('./oauth/oauth-client.js')} OAuth
     * @typedef {import('./types/api-client-types.js').ApiClientConfig} ApiClientConfig
     */

    /**
     * @param { ApiClientConfig } config
     * @param { OAuth } oauth
     */
    constructor({ baseUrl, timeoutInterval = 30, headers = {}}, oauth) {
        this._baseUrl = baseUrl;
        this._timeoutInterval = timeoutInterval;
        this._headers = headers;
        this._oauth = oauth;
    };    

    /**
     * @param {string} endpoint 
     * @param {Object} [params] 
     * @returns {Promise<JSON | null>}
     */
    async get(endpoint, params = {}) {
        const url = this._buildUrl(endpoint, params);
        const req = await this._buildRequest(url, "GET");
        return await this._handleResponse(req);
    }
    
    /**
     * @param {string} endpoint 
     * @param {Object} [params] 
     * @returns {Promise<JSON | null>}
     */
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
     * @returns {Promise<JSON | null>}
     */
    async post(endpoint, body = {}, params = {}) {
        const url = this._buildUrl(endpoint, params);
        const req = await this._buildRequest(url, "POST");
        
        req.headers["Content-Type"] = "application/json";
        req.body = JSON.stringify(body);

        return await this._handleResponse(req);
    }

    /**
     * @param {string} url 
     * @param {string} method 
     * @returns {Promise<Request>}
     */
    async _buildRequest(url, method) {
        const token = await this._oauth.getToken();
        const req = new Request(url);
        req.method = method;
        
        req.headers = { 
            ...this._headers,
            "Authorization": `Bearer ${token}`,
        };
        
        req.timeoutInterval = this._timeoutInterval;
        
        return req;
    }

    /**
     * 
     * @param {Request} req 
     * @returns {Promise<JSON | null>}
     * @throws {Error} if response status is >= 400
     */
    async _handleResponse(req) {
        const res = await req.loadString();
        const status = req.response.statusCode;
        
        console.log(
            `${req.method}    ${req.url}    ${status}`
        );
        
        if (status === 401) {
            this._oauth.clearTokens();
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
     * @returns {string}
     */
    _buildUrl(endpoint, params = {}) {
        const path = endpoint.startsWith("http")
            ? endpoint
            : `${this._baseUrl}${endpoint}`;
        const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
        
        return queryString
            ? `${path}?${queryString}`
            : path;
    }
}

module.exports = ApiClient;