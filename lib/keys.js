module.exports = {
    SPOTIFY: {
        CLIENT_ID_KEY: 'spotify-client-id',
        CLIENT_SECRET_KEY: 'spotify-client-secret',
        ACCESS_TOKEN_KEY: 'spotify-token',
        EXPIRES_IN_KEY: 'spotify-expires-in',
        REFRESH_TOKEN_KEY: 'refresh-token-key',

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