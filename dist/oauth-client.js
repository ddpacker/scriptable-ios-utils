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
        const state = Keychain.get(this.config.accessTokenKey + '-state');

        if (state !== args.state) { 
            throw new Error('Auth State Mismatch - Potential');
        }

        Keychain.remove(this.config.accessTokenKey + '-state');

        const req = new Request(this.config.tokenUrl);

        req.method = 'POST';
        req.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`,
        };

        req.body = `code=${encodeURIComponent(args.code)}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}&grant_type=authorization_code`;

        const data = await req.loadJSON();

        if (data.error) {
            throw new Error(`Auth Error: ${data.message}`);
        }

        Keychain.set(this.config.accessTokenKey, data.access_token);
        Keychain.set(this.config.expiresInKey, data.expires_in.toString());
        Keychain.set(this.config.refreshTokenKey, data.refresh_token);
    }
    
    /**
     * @param {Object} params
     * @param {string} params.code
     * @param {string} params.state
     * @param {string} params.error
     */
    async login(params) {
        if (params.error) {
            throw new Error(`Auth Error: ${params.error}`);
        }

        if (params.code && params.state) {
            await this.handleCallback(params);
        } else {
            await this.authorize();
        }
    }

    async getToken() {
        const token = Keychain.get(this.config.accessTokenKey);
        return Keychain.get(this.config.accessTokenKey);
    }

    async refreshToken() {
        
    }

    isTokenExpired() {

    }

    clearToken() {
        
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