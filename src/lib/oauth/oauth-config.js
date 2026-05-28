const CONFIG = importModule("config");

/**
 * @param {string} service
 * @returns {Object}
 * @throws {Error}
 */
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
        authUrl: CONFIG[s].AUTH_URL,
        tokenUrl: CONFIG[s].TOKEN_URL,
        redirectUri: CONFIG[s].REDIRECT_URI,
        scopes: CONFIG[s].SCOPES,
    };
}

module.exports = {
    getOAuthConfig
};