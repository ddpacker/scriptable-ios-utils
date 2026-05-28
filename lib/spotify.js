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

    async getUserInfo() {
        return this.api_client.get('/me');
    }

    async getCurrentlyPlaying() {
        return this.api_client.get('/me/player/currently-playing');
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
        return this.api_client.get('/me/playlists', { offset: offset, limit: 50 });
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
                }
            }
        }
    }

}

module.exports = Spotify;