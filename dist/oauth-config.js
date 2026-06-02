// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
const CONFIG = importModule("config");
const KEYS = importModule("keys")

function getOAuthConfig(service) {
    const s = service.toUpperCase();

    const clientId = Keychain.get(`${s}_CLIENT_ID`);
    const clientSecret = Keychain.get(`${s}_CLIENT_SECRET`);

    if (!clientId || !clientSecret) {
        throw new Error(`Missing credentials for ${service}`);
    }

    return {
        clientId: clientId,
        clientSecret: clientSecret,
        accessTokenKey: KEYS[s].ACCESS_TOKEN,
        refreshTokenKey: KEYS[s].REFRESH_TOKEN,
        expiresInKey: KEYS[s].EXPIRES_IN,
        tokenUrl: CONFIG[s].TOKEN_URL,
        redirectUri: CONFIG[s].REDIRECT_URI,
        authorizationUrl: CONFIG[s].AUTHORIZATION_URL,
        scopes: CONFIG[s].SCOPES,
    };
}

module.exports = {
    getOAuthConfig
};