/**
 * @typedef {Object} ServiceConfig
 * @property {string} BASE_PATH
 * @property {string} AUTHORIZATION_URL
 * @property {string} TOKEN_URL
 * @property {string} REDIRECT_URI
 * @property {string[]} SCOPES
 */

/**
 * @type {Record<string, ServiceConfig>}
 */
const Config = {
    SPOTIFY: {
        BASE_PATH: 'https://api.spotify.com/v1',
        AUTHORIZATION_URL: 'https://accounts.spotify.com/authorize',
        TOKEN_URL: 'https://accounts.spotify.com/api/token',
        REDIRECT_URI: 'scriptable:///run/utl-spotify-login',
        SCOPES: [
            'playlist-modify-public', 
            'playlist-modify-private', 
            'user-read-playback-state', 
            'user-modify-playback-state',
            'playlist-read-private'
        ],
    },
}

module.exports = Config;