// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
class StaticTokenAuthProvider {

    /**
     * @param {{ tokenKey: string }} options
     */
    constructor({ tokenKey }) {
        this._tokenKey = tokenKey;
    }

    /**
     * @returns {Promise<Record<string, string>>}
     */
    async getHeaders() {
        if (!Keychain.contains(this._tokenKey)) {
            throw new Error(`Missing auth token in Keychain (${this._tokenKey}). Store it with your service's config util.`);
        }
        const token = Keychain.get(this._tokenKey);
        return { Authorization: `Bearer ${token}` };
    }

    onUnauthorized() {
        // Static tokens are not refreshed; re-seed via the feature's config util.
    }
}

module.exports = StaticTokenAuthProvider;
