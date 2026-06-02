/**
 * @typedef {Object} OAuthTokenResponse
 * @property {string} access_token    // The access token
 * @property {string} token_type      // Usually 'Bearer'
 * @property {number} expires_in      // Expiry duration in seconds
 * @property {string} [refresh_token] // Omitted if not applicable (e.g. client credentials flow)
 * @property {string} [scope]         // Space-separated list of granted scopes
 */

/**
 * @typedef {Object} OAuthTokens
 * @property {string} accessToken
 * @property {number} expiresIn
 * @property {string} refreshToken
 */

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

module.exports = {};