// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;

const Config = {
    SPOTIFY: {
        BASE_PATH: 'https://api.spotify.com/v1',
        AUTHORIZATION_URL: 'https://accounts.spotify.com/authorize',
        TOKEN_URL: 'https://accounts.spotify.com/api/token',
        REDIRECT_URI: 'scriptable:///run/oauth-callback?service=spotify',
        SCOPES: [
            'playlist-modify-public', 'playlist-modify-private', 
            'user-read-playback-state', 'user-modify-playback-state',
            'playlist-read-private',
            'user-read-recently-played',
            'user-library-read', 'user-library-modify',
            'user-follow-read', 'user-follow-modify',
        ],
    },
}

module.exports = Config;