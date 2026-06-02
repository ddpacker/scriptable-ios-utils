// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
class OAuthClient{

    
    constructor(config) {
        this._config = config;
    }

// --------------------
// ------ PUBLIC ------
// --------------------


    async authorize() {
        const url = this._getAuthorizationUrl();
        await Safari.open(url);
    }


    async handleCallback(args) {
        this._validateState(args.state);
        const req = this._buildTokenRequest(args.code);
        const res = await this._handleResponse(req);
        this._storeTokens(res);
    }


    async getToken() {
        let { accessToken, expiresIn, refreshToken } = this._loadTokens();

        if (Date.now() < expiresIn) return accessToken;
        
        if (!refreshToken) throw new Error("Token expired and no refresh token available, please re-authenticate.");
        
        return await this._refreshAccessToken(refreshToken);
    }


    clearTokens() {
        [this._config.accessTokenKey, this._config.expiresInKey, this._config.refreshTokenKey].forEach(key => {
            try {
                Keychain.remove(key);
            }
            catch { /* no-op */ }
        });
    }


// ---------------------
// ------ PRIVATE ------
// ---------------------


    _storeTokens(res) {
        Keychain.set(this._config.accessTokenKey, res.access_token);
        Keychain.set(this._config.expiresInKey, (Date.now() + (res.expires_in * 1000)).toString());
        Keychain.set(this._config.refreshTokenKey, res.refresh_token ?? "");
    }


    async _handleResponse(req) {
        const res = await req.loadJSON();

        if (res.error) throw new Error(`Auth Error: ${res.message}`);
        
        return res;
    }


    _buildTokenRequest(authCode) {
        const req = new Request(this._config.tokenUrl);

        req.method = 'POST';
        req.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${this._config.clientId}:${this._config.clientSecret}`)}`,
        };

        req.body = `code=${encodeURIComponent(authCode)}&redirect_uri=${encodeURIComponent(this._config.redirectUri)}&grant_type=authorization_code`;
        
        return req;
    }


    _validateState(returnedState) {
        const storedState = Keychain.get(this._config.accessTokenKey + '-state');

        if (storedState !== returnedState) throw new Error('Auth State Mismatch - Potential CSRF');
    }


    _loadTokens() {
        try {
            return {
                accessToken: Keychain.get(this._config.accessTokenKey),
                expiresIn: parseInt(Keychain.get(this._config.expiresInKey), 10),
                refreshToken: Keychain.get(this._config.refreshTokenKey),
            };
        } catch {
            this.clearTokens();
            throw new Error("Access token invalid, please re-authenticate.");
        };
    }


    async _refreshAccessToken(refreshToken) {
        const req = this._buildRefreshRequest(refreshToken)

        const data = await req.loadJSON();

        if (data.error) {
            throw new Error(`Auth Error: ${data.message}`);
        }

        Keychain.set(this._config.accessTokenKey, data.access_token);
        Keychain.set(this._config.expiresInKey, (Date.now() + (data.expires_in * 1000)).toString());

        if (data.refresh_token) {
            Keychain.set(this._config.refreshTokenKey, data.refresh_token);
        }

        return data.access_token;
    }


    _buildRefreshRequest(refreshToken) {
        const req = new Request(this._config.tokenUrl);
        req.method = 'POST';
        req.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${this._config.clientId}:${this._config.clientSecret}`)}`,
        };
        req.body = `refresh_token=${encodeURIComponent(refreshToken)}&grant_type=refresh_token`;
        
        return req;
    }


    _getAuthorizationUrl() {
        const state = this._generateUUID();
        Keychain.set(this._config.accessTokenKey + '-state', state);
          const params = [
            `client_id=${encodeURIComponent(this._config.clientId)}`,
            `response_type=code`,
            `redirect_uri=${encodeURIComponent(this._config.redirectUri)}`,
            `scope=${encodeURIComponent(this._config.scopes.join(' '))}`,
            `state=${encodeURIComponent(state)}`,
        ].join("&");

        return `${this._config.authorizationUrl}?${params}`;
    }


    _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}

module.exports = OAuthClient;