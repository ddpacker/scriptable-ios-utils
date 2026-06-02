// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
const CONFIG = importModule("config");

const OAuthClient = importModule('oauth-client');
const ApiClient = importModule('api-client');

const { getOAuthConfig } = importModule('oauth-config');



class Spotify {

    constructor() {
        this._oauth = new OAuthClient(getOAuthConfig("spotify"));

        this._apiClient = new ApiClient({
            baseUrl: CONFIG.SPOTIFY.BASE_PATH,
        }, this._oauth);
    }

// --------------------
// ------ PUBLIC ------
// --------------------


    async login() {
        await this._oauth.authorize();
    }


    async getCurrentlyPlaying() {
        return this._apiClient.get('/me/player/currently-playing');
    }


    async getUserPlaylists(query = { offset: 0, limit: 50 }) {
        const playlists = await this._apiClient.get('/me/playlists', query);
    
        if (!playlists) throw new Error("Couldn't fetch user's playlists");

        return playlists;
    }


    async getMonthlyPlaylist() {
        const monthlyPlaylistTitle = this._getMonthlyPlaylistTitle();

        let monthlyPlaylist = await this._searchForPlaylists(monthlyPlaylistTitle);
        
        if (monthlyPlaylist) return monthlyPlaylist;

        return this.createPlaylist({
            name: monthlyPlaylistTitle,
            description: `A playlist for ${monthlyPlaylistTitle}`,
        });
    }


    async getPlaylistItems(playlistId, query = {}) {
        return this._apiClient.get(`/playlists/${playlistId}/items`, query);
    }


    async addToPlaylist(playlistId, body) {
        return this._apiClient.post(`/playlists/${playlistId}/items`, body);
    }


    async createPlaylist(body) {
        return this._apiClient.post('/me/playlists', body);
    }


// ---------------------
// ------ PRIVATE ------
// ---------------------

    _getMonthlyPlaylistTitle() {
        return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }


    async _searchForPlaylists(name) {
        let offset = 0;
        let limit = 50;
        while (true) {
            const res = await this.getUserPlaylists({ offset: offset, limit: limit });
            const playlist = res.items.find((p) => p.name === name);
            if (playlist) return playlist;
            if (!res.next) return null;
            offset += limit;
        }
    }
}

module.exports = Spotify;