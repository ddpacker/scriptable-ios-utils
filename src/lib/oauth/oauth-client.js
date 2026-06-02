// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
class OAuthClient{

    /**
     * @typedef {Object} OAuthConfig
     * @property {string} clientId
     * @property {string} clientSecret
     * @property {string} authorizationUrl
     * @property {string} tokenUrl
     * @property {string} redirectUri
     * @property {string[]} scopes
     * @property {string} accessTokenKey
     * @property {string} expiresInKey
     * @property {string} refreshTokenKey 
     */
    
    /**
     * @param {OAuthConfig} config
     */
    constructor(config) {
        this.config = config;
    }

    async authorize() {
        const url = this.getAuthorizationUrl();
        await Safari.open(url);
    }

    /**
     * @param {Object} args
     *  @param {string} args.code
     *  @param {string} args.state
     */
    async handleCallback(args) {
        this._validateState(args.state);
        const req = this._buildTokenRequest(args.code);
        const res = await this._handleResponse(req);
        this._storeTokens(res);
    }
    
    _storeTokens(res) {
        Keychain.set(this.config.accessTokenKey, res.access_token);
        Keychain.set(this.config.expiresInKey, (Date.now() + (res.expires_in * 1000)).toString());
        Keychain.set(this.config.refreshTokenKey, res.refresh_token ?? "");
    }
    
    async _handleResponse(req) {
        const res = await req.loadJSON();

        if (res.error) throw new Error(`Auth Error: ${res.message}`);
        
        return res;
    }

    _buildTokenRequest(authCode) {
        const req = new Request(this.config.tokenUrl);

        req.method = 'POST';
        req.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`,
        };

        req.body = `code=${encodeURIComponent(authCode)}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}&grant_type=authorization_code`;
        
        return req;
    }
    
    _validateState(returnedState) {
        const storedState = Keychain.get(this.config.accessTokenKey + '-state');

        if (storedState !== returnedState) throw new Error('Auth State Mismatch - Potential CSRF');
    }

    async getToken() {
        let { accessToken, expiresIn, refreshToken } = this._loadTokens();

        if (Date.now() < expiresIn) return accessToken;
        
        if (!refreshToken) throw new Error("Token expired and no refresh token available, please re-authenticate.");
        
        return await this.refreshAccessToken(refreshToken);
    }
    
    _loadTokens() {
        try {
            return {
                accessToken: Keychain.get(this.config.accessTokenKey),
            expiresIn: parseInt(Keychain.get(this.config.expiresInKey), 10),
            refreshToken: Keychain.get(this.config.refreshTokenKey),
            };
        } catch {
            this.clearTokens();
            throw new Error("Access token invalid, please re-authenticate.");
        };
    }

    /**
     * 
     * @param {string} refreshToken 
     * @returns 
     */
    async refreshAccessToken(refreshToken) {
        const req = this._buildRefreshRequest(refreshToken)

        const data = await req.loadJSON();

        if (data.error) {
            throw new Error(`Auth Error: ${data.message}`);
        }

        Keychain.set(this.config.accessTokenKey, data.access_token);
        Keychain.set(this.config.expiresInKey, (Date.now() + (data.expires_in * 1000)).toString());

        if (data.refresh_token) {
            Keychain.set(this.config.refreshTokenKey, data.refresh_token);
        }

        return data.access_token;
    }
    
    _buildRefreshRequest(refreshToken) {
        const req = new Request(this.config.tokenUrl);
        req.method = 'POST';
        req.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`,
        };
        req.body = `refresh_token=${encodeURIComponent(refreshToken)}&grant_type=refresh_token`;
        
        return req;
    }

    clearTokens() {
        [this.config.accessTokenKey, this.config.expiresInKey, this.config.refreshTokenKey].forEach(key => {
            try {
                Keychain.remove(key);
            }
            catch {
                // Ignore if key doesn't exist
            }
        });
    }

    getAuthorizationUrl() {
        const state = this.generateUUID();
        Keychain.set(this.config.accessTokenKey + '-state', state);
          const params = [
            `client_id=${encodeURIComponent(this.config.clientId)}`,
            `response_type=code`,
            `redirect_uri=${encodeURIComponent(this.config.redirectUri)}`,
            `scope=${encodeURIComponent(this.config.scopes.join(' '))}`,
            `state=${encodeURIComponent(state)}`,
        ].join("&");

        return `${this.config.authorizationUrl}?${params}`;
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}

module.exports = OAuthClient;