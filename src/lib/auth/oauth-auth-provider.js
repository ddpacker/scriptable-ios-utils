// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
class OAuthAuthProvider {

    /**
     * @param {{ getToken: () => Promise<string>, clearTokens: () => void }} oauth
     */
    constructor(oauth) {
        this._oauth = oauth;
    }

    /**
     * @returns {Promise<Record<string, string>>}
     */
    async getHeaders() {
        const token = await this._oauth.getToken();
        return { Authorization: `Bearer ${token}` };
    }

    onUnauthorized() {
        this._oauth.clearTokens();
    }
}

module.exports = OAuthAuthProvider;
