// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
const CONFIG = importModule("config");

const OAuthClient = importModule('oauth-client');
const ApiClient = importModule('api-client');
const { DuplicateError } = importModule('errors');


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
 * @typedef {import('./types/spotify-types').CheckUsersSavedItemsQuery}        CheckUsersSavedItemsQuery
 * @typedef {import('./types/spotify-types').CheckUsersSavedItemsResponse}     CheckUsersSavedItemsResponse
 * @typedef {import('./types/spotify-types').SaveItemsToLibraryQuery}          SaveItemsToLibraryQuery
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
     * @param { Playlist } playlist
     * @param { Track } track
     * @returns { Promise<void> }
     */
    async addToPlaylist(playlist, track) {
        if (await this._isSongInPlaylist(playlist.id, track.uri)) {
            throw new DuplicateError(`${track.name} is already in ${playlist.name}!`)
        }

        /** @type { AddToPlaylistBody } */
        const body = { uris: [track.uri] };

        await this._apiClient.post(`/playlists/${playlist.id}/items`, body);
    }

    /**
     * @param {Album | Track} item
     * @returns {Promise<void>}
     */
    async saveToLibrary(item) {
        if (await this._isItemInLibrary(item.uri)) {
            throw new DuplicateError(`${item.name} is already in your library!`)
        }

        /** @type { SaveItemsToLibraryQuery } */
        const query = { uris: item.uri };

        await this._apiClient.put('/me/library', query);
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
     * @param {string} playlistId
     * @param {string} songUri
     * @returns {Promise<boolean>}
     */
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

    /**
     * 
     * @param {string} uri 
     * @returns {Promise<boolean>}
     */
    async _isItemInLibrary(uri) {
        const res = await this._apiClient.get('/me/library/contains', { uris: [uri] });
        return res[0];
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