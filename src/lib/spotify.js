// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
// TODO: Update JSDocs
// TODO: Move typedefs to a separate file
// TODO: Update README.md

const CONFIG = importModule("config");

const OAuthClient = importModule('oauth-client');
const ApiClient = importModule('api-client');

const { getOAuthConfig } = importModule('oauth-config');

/**
 * @typedef {Object} TrackObject
 * @property {Object} Album
 * @property {Object} Artists
 * @property {string} id
 * @property {string} name
 * @property {string} uri
 */

/** 
 * @typedef {Object} PlaylistTrackObject
 * @property {TrackObject} item
*/

/**
 * @typedef {Object} PlaylistObject
 * @property {string} id
 * @property {string} name
 * @property {string} uri
 * @property {Object} items
 * @property {PlaylistTrackObject[]} items.items
 */

class Spotify {

    constructor() {
        this.oauth = new OAuthClient(getOAuthConfig("spotify"));

        this.api_client = new ApiClient({
            baseUrl: CONFIG.SPOTIFY.BASE_PATH,
            
        }, this.oauth);
    }

    async login() {
        await this.oauth.authorize();
    }

    async getUserInfo() {
        return this.api_client.get('/me');
    }

    async getCurrentlyPlaying() {
        const res = await this.api_client.get('/me/player/currently-playing');
        return res?.item ?? null;
    }
    
    /**
     * 
     * @param {PlaylistObject} playlist 
     * @param {string} track_uri
     * @return {Promise<boolean>}
     */
    async isSongInPlaylist(playlist, track_uri) {
        const track = playlist.items.items.find((t) => t.item.uri === track_uri);
        return !!track;
    };
    
    async getPlaylistItems(playlist_id) {
        const res = await this.api_client.get(`/playlists/${playlist_id}/items`);

        return res?.items.map((pli) => pli.item.uri) ?? []
    }

    async getMonthlyPlaylist() {
        const monthly_playlist_title = new Date().toLocaleDateString(
            'en-US', { month: 'long', year: 'numeric' }
        );

        var monthly_playlist;
        monthly_playlist = await this.searchForPlaylists(monthly_playlist_title);
        
        if (!monthly_playlist) {
            monthly_playlist = await this.createPlaylist(monthly_playlist_title);
        } 

        return monthly_playlist;
    }

    /**
     * 
     * @param {string} playlist_id 
     * @param {string} track_uris 
     * @returns 
     */
    async addToPlaylist(playlist_id, track_uris) {
        return this.api_client.post(`/playlists/${playlist_id}/items`, { uris: track_uris });
    }

    async addToLibrary(track_uris) {
        return this.api_client.put(`/me/library`, { uris: track_uris });
    }
    
    /**
     * 
     * @param {string} name 
     * @returns
     */
    async createPlaylist(name) {
        return this.api_client.post('/me/playlists', { name: name });
    }

    /**
     * 
     * @param {number} [offset=0] 
     * @returns 
     */
    async getUserPlaylists(offset = 0) {
        const playlists = await this.api_client.get('/me/playlists', { offset: offset, limit: 50 });
    
        return playlists;
    }

    /**
     * @param {string} name 
     * @returns 
     */
    async searchForPlaylists(name) {
        var offset = 0;
        while (true) {
            const res = await this.getUserPlaylists(offset);
            if (res) {
                const playlist = res.items.find((/** @type {{ name: string; }} */ p) => p.name === name);
                if (playlist) return playlist;
                if (res.next) { 
                    offset += res.limit;
                } else {
                    break;
                }
            }
        }
    }

}

module.exports = Spotify;