// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
const OAuthClient = importModule('oauth-client');
const { getOAuthConfig } = importModule('oauth-config');

(async () => {
    const params = args.queryParameters;
    const config = getOAuthConfig(params.service);
    const oauth = new OAuthClient(config);
    await oauth.handleCallback(params);
})();