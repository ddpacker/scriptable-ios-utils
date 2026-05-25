const OAuth = importModule('oauth');
const { SPOTIFY }= importModule('keys');

class Spotify {

    constructor() {
        this.oauth = new OAuth({
            clientId: Keychain.get(SPOTIFY.CLIENT_ID_KEY),
            clientSecret: Keychain.get(SPOTIFY.CLIENT_SECRET_KEY),
            authorizationUrl: SPOTIFY.AUTHORIZATION_URL,
            tokenUrl: SPOTIFY.TOKEN_URL,
            redirectUri: SPOTIFY.REDIRECT_URI,
            scopes: SPOTIFY.SCOPES,
            accessTokenKey: SPOTIFY.ACCESS_TOKEN_KEY,
            expiresInKey: SPOTIFY.EXPIRES_IN_KEY,
             refreshTokenKey: SPOTIFY.REFRESH_TOKEN_KEY,
        });
    }

    async login() {
        const params = args.queryParameters;

        if (params.error) {
            throw new Error(`Auth Error: ${params.error}`);
        }

        if (params.code && params.state) {
            await this.oauth.handleCallback(params);
        } else {
            await this.oauth.authorize();
        }
    }

    async getUserInfo() {
        const token = await this.oauth.getToken();
        const req = new Request('https://api.spotify.com/v1/me');
        req.method = 'GET';
        req.headers = {
            'Authorization': `Bearer ${token}`,
        };

        const data = await req.loadJSON();

        if (data.error) {
            throw new Error(`User Info Error: ${data.message}`);
        }

        return data;
    }
}

module.exports = Spotify;