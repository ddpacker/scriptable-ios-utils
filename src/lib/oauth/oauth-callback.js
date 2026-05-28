const OAuthClient = importModule('oauth');
const { getOAuthConfig } = importModule('oauth-config');

(async () => {
    const params = args.queryParameters;
    const config = getOAuthConfig(params.service);
    const oauth = new OAuthClient(config);
    await oauth.login(params);
})();