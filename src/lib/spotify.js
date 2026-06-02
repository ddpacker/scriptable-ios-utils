// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
// TODO: Update README.md

const CONFIG = importModule("config");

const OAuthClient = importModule('oauth-client');
const ApiClient = importModule('api-client');

const { getOAuthConfig } = importModule('oauth-config');

/**
 * @typedef {import('./types/spotify-types').GetCurrentUserPlaylistsQuery}     GetCurrentUserPlaylistsQuery
 * @typedef {import('./types/spotify-types').GetCurrentUserPlaylistsResponse}  GetCurrentUserPlaylistsResponse
 * @typedef {import('./types/spotify-types').GetPlaylistItemsQuery}            GetPlaylistItemsQuery
 * @typedef {import('./types/spotify-types').GetPlaylistItemsResponse}         GetPlaylistItemsResponse
 * @typedef {import('./types/spotify-types').GetCurrentlyPlayingResponse}      GetCurrentlyPlayingResponse
 * @typedef {import('./types/spotify-types').AddToPlaylistBody}                AddToPlaylistBody
 * @typedef {import('./types/spotify-types').AddToPlaylistResponse}            AddToPlaylistResponse
 * @typedef {import('./types/spotify-types').CreatePlaylistBody}               CreatePlaylistBody
 */

/**
 * @typedef {import('./types/spotify-types').Playlist}            Playlist
 * @typedef {import('./types/spotify-types').PlaylistTrackObject} PlaylistTrackObject
 * @typedef {import('./types/spotify-types').Track}               Track
 * @typedef {import('./types/spotify-types').Album}               Album
 * @typedef {import('./types/spotify-types').Artist}              Artist
 * @typedef {import('./types/spotify-types').Image}               Image
 * @typedef {import('./types/spotify-types').Owner}               Owner
 * @typedef {import('./types/spotify-types').Device}              Device
 * @typedef {import('./types/spotify-types').Context}             Context
 * @typedef {import('./types/spotify-types').Actions}             Actions
 * @typedef {import('./types/spotify-types').ExternalUrls}        ExternalUrls
 */

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


    /**
     * @returns {Promise<GetCurrentlyPlayingResponse | null>}
    */
    async getCurrentlyPlaying() {
        return this._apiClient.get('/me/player/currently-playing');
    }


    /**
     * @param {GetCurrentUserPlaylistsQuery} [query] 
     * @returns {Promise<GetCurrentUserPlaylistsResponse>}
     * @throws {Error} If not able to fetch user's playlists
    */
    async getUserPlaylists(query = { offset: 0, limit: 50 }) {
        const playlists = await this._apiClient.get('/me/playlists', query);
    
        if (!playlists) throw new Error("Couldn't fetch user's playlists");

        return playlists;
    }


    /**
     * @returns {Promise<Playlist>}
    */
    async getMonthlyPlaylist() {
        const monthlyPlaylistTitle = this._getMonthlyPlaylistTitle();

        let monthlyPlaylist = await this._searchForPlaylists(monthlyPlaylistTitle);
        
        if (monthlyPlaylist) return monthlyPlaylist;

        return this.createPlaylist({
            name: monthlyPlaylistTitle,
            description: `A playlist for ${monthlyPlaylistTitle}`,
        });
    }


    /**
     * @param {string} playlistId
     * @param {GetPlaylistItemsQuery} [query]
     * @returns {Promise<GetPlaylistItemsResponse>}
     */
    async getPlaylistItems(playlistId, query = {}) {
        return this._apiClient.get(`/playlists/${playlistId}/items`, query);
    }


    /**
     * @param {string} playlistId
     * @param {AddToPlaylistBody} body
     * @returns {Promise<AddToPlaylistResponse>}
     */
    async addToPlaylist(playlistId, body) {
        return this._apiClient.post(`/playlists/${playlistId}/items`, body);
    }


    /**
     * @param {CreatePlaylistBody} body
     * @returns {Promise<Playlist>}
     */
    async createPlaylist(body) {
        return this._apiClient.post('/me/playlists', body);
    }


// ---------------------
// ------ PRIVATE ------
// ---------------------

    /**
     * @returns {string}
     */
    _getMonthlyPlaylistTitle() {
        return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }


    /**
     * @param {string} name 
     * @returns {Promise<Playlist | null>}
     */
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