// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
const CONFIG = importModule("config");

const OAuthClient = importModule('oauth-client');
const ApiClient = importModule('api-client');
const { DuplicateError } = importModule('errors');


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



    async addToPlaylist(playlist, track) {
        if (await this._isSongInPlaylist(playlist.id, track.uri)) {
            throw new DuplicateError(`${track.name} is already in ${playlist.name}!`)
        }

        const body = { uris: [track.uri] };

        await this._apiClient.post(`/playlists/${playlist.id}/items`, body);
    }

    async saveToLibrary(item) {
        if (await this._isItemInLibrary(item.uri)) {
            throw new DuplicateError(`${item.name} is already in your library!`)
        }

        const query = { uris: item.uri };

        await this._apiClient.put('/me/library', query);
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


    async _isSongInPlaylist(playlistId, songUri) {
        let offset = 0;
        let limit = 50;
        while (true) {
            const res = await this.getPlaylistItems(playlistId, { offset: offset, limit: limit });
            const song = res.items.find((p) => p.item?.uri === songUri);
            if (song) return true;
            if (!res.next) return false;
            offset += limit;
        }
    }

    async _isItemInLibrary(uri) {
        const res = await this._apiClient.get('/me/library/contains', { uris: [uri] });
        return res[0];
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