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
     * @param {Oauth} [oauth]
     */
    constructor({ baseUrl, timeoutInterval = 30, headers = {} }, oauth) {
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
        const headers = { ...this.headers };

        if (this.oauth) {
            const token = await this.oauth.getToken();
            headers["Authorization"] = `Bearer ${token}`;
        }

        const url = this._buildUrl(endpoint, params);
        const req = new Request(url);
        req.timeoutInterval = this.timeoutInterval;
        Object.entries(headers).forEach(([k, v]) => req.headers[k] = v);
        
        const res = await req.loadJSON();
        const status = req.response.statusCode;
        
        if (status === 401) throw new Error("Unauthorized — token may be expired");
        if (status >= 400) throw new Error(`HTTP ${status}: ${JSON.stringify(res)}`);
        
        return res;
    }

    /**
     * @param {string} endpoint 
     * @param {Object} [body]
     * @param {Object} [params]
     * @returns 
     */
    async post(endpoint, body = {}, params = {}) {
        const headers = { ...this.headers };
        headers["Content-Type"] = "application/json";

        if (this.oauth) {
            const token = await this.oauth.getToken();
            headers["Authorization"] = `Bearer ${token}`;
        }

        const url = this._buildUrl(endpoint, params);
        const req = new Request(url);
        req.method = "POST";
        req.timeoutInterval = this.timeoutInterval;
        Object.entries(headers).forEach(([k, v]) => req.headers[k] = v);
        req.body = JSON.stringify(body);

        const res = await req.loadJSON();
        const status = req.response.statusCode;

        if (status === 401) throw new Error("Unauthorized — token may be expired");
        if (status >= 400) throw new Error(`HTTP ${status}: ${JSON.stringify(res)}`);
        
        return res;
    }

    /**
     * @param {string} endpoint 
     * @param {Object} params 
     * @returns 
     */
    _buildUrl(endpoint, params = {}) {
    const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
    return queryString
        ? `${this.baseUrl}${endpoint}?${queryString}`
        : `${this.baseUrl}${endpoint}`;
    }
}

module.exports = ApiClient;