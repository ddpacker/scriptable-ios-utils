// -----------------
// ------ GET ------
// -----------------


/**
 * @typedef {Object} GetCurrentUserPlaylistsQuery
 * @property {number} [offset=0]  // Index of the first playlist to return (max 100,000)
 * @property {number} [limit=20]  // Max items to return (default 20, max 50)
 * 
 *    Endpoint: GET      /me/playlists
 *    Scopes:   playlist-read-private, playlist-read-collaborative
 *    @see https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
 * 
 */
    /**
     * @typedef {Object} GetCurrentUserPlaylistsResponse
     * @property {string}     href      // Link to the Web API endpoint returning the full result
     * @property {number}     limit     // The maximum number of items in the response
     * @property {string|null} next     // URL to the next page, or null
     * @property {number}     offset    // The offset of the items returned
     * @property {string|null} previous // URL to the previous page, or null
     * @property {number}     total     // Total number of items available to return
     * @property {Playlist[]} items
     */


/**
 * @typedef {Object} GetPlaylistItemsQuery
 * @property {string} [market]           // ISO 3166-1 alpha-2 country code for market filtering
 * @property {string} [fields]           // Comma-separated list of fields to return
 * @property {number} [limit=20]         // Max items to return (max 50)
 * @property {number} [offset=0]         // Index of the first item to return
 * @property {string} [additional_types] // Comma-separated item types beyond 'track' (e.g. 'episode')
 * 
 *    Endpoint: GET      /playlists/{playlist_id}/items
 *    Scopes:   playlist-read-private
 *    @see https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
 * 
 */
    /**
     * @typedef {Object} GetPlaylistItemsResponse
     * @property {string}                href     // Link to the Web API endpoint returning the full result
     * @property {number}                limit    // The maximum number of items in the response
     * @property {string|null}           next     // URL to the next page, or null
     * @property {number}                offset   // The offset of the items returned
     * @property {string|null}           previous // URL to the previous page, or null
     * @property {number}                total    // Total number of items available to return
     * @property {PlaylistTrackObject[]} items
     */


/**
 * @typedef {Object} GetCurrentlyPlayingQuery
 * @property {string} [market]           // ISO 3166-1 alpha-2 country code for market filtering
 * @property {string} [additional_types] // Comma-separated item types beyond 'track' (e.g. 'episode')
 * 
 *    Endpoint: GET      /me/player/currently-playing
 *    Scopes:   user-read-currently-playing
 *    @see https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
 * 
 */
    /**
     * @typedef {Object} GetCurrentlyPlayingResponse
     * @property {Device}       device                 // The device that is currently active
     * @property {string}       repeat_state           // 'off', 'track', or 'context'
     * @property {boolean}      shuffle_state          // Whether shuffle is on or off
     * @property {Context|null} context                // A Context Object; can be null
     * @property {number}       timestamp              // Unix millisecond timestamp when playback state last changed
     * @property {number|null}  progress_ms            // Progress into the currently playing track or episode; can be null
     * @property {boolean}      is_playing             // Whether something is currently playing
     * @property {Track|null}   item                   // The currently playing track or episode; can be null
     * @property {string}       currently_playing_type // 'track', 'episode', 'ad', or 'unknown'
     * @property {Actions}      actions                // Allows updating the UI based on which playback actions are available
     */


/**
 * @typedef {Object} CheckUsersSavedItemsQuery
 * @property {string} uris // Spotify URIs to check (max 40 per request)
 * 
 *    Endpoint: GET      /me/library/contains
 *    Scopes:   user-library-read, user-follow-read, playlist-read-private
 *    @see https://developer.spotify.com/documentation/web-api/reference/check-library-contains
 * 
 */
    /**
     * @typedef {boolean[]} CheckUsersSavedItemsResponse // Array of booleans indicating presence of each URI in the user's library
     */


// -----------------
// ------ PUT ------
// -----------------

/**
 * @typedef {Object} SaveItemsToLibraryQuery
 * @property {string} uris // Spotify URIs to add (max 40 per request)
 * @returns { Promise<boolean> } // Indicates success
 * 
 *    Endpoint: PUT      /me/library
 *    Scopes:   user-library-modify, user-follow-modify, playlist-modify-public
 *    @see https://developer.spotify.com/documentation/web-api/reference/save-library-items
 * 
 */


// ------------------
// ------ POST ------
// ------------------


/**
 * @typedef {Object} AddToPlaylistBody
 * @property {string[]} uris       // Spotify URIs to add (max 100 per request)
 * 
 *    Endpoint: POST     /playlists/{playlist_id}/items
 *    Scopes:   playlist-modify-public, playlist-modify-private
 *    @see https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
 */
    /**
     * @typedef {Object} AddToPlaylistResponse
     * @property {string} snapshot_id // A snapshot ID for the playlist
     */


/**
 * @typedef {Object} CreatePlaylistBody
 * @property {string}  name                  // Name for the new playlist
 * @property {boolean} [public=true]         // Whether the playlist is visible on the user's profile
 * @property {boolean} [collaborative=false] // Whether others can modify the playlist; requires public=false
 * @property {string}  [description]         // Playlist description shown in Spotify clients
 * 
 *    Endpoint: POST     /me/playlists
 *    Scopes:   playlist-modify-public, playlist-modify-private
 *    @see https://developer.spotify.com/documentation/web-api/reference/create-playlist
 * 
 */


// ---------------------
// ------ OBJECTS ------
// ---------------------


/**
 * @typedef {Object} ExternalUrls
 * @property {string} spotify // The Spotify URL for the object
 */


/**
 * @typedef {Object} Image
 * @property {number} height // Height in pixels
 * @property {number} width  // Width in pixels
 * @property {string} url    // Image source URL
 */


/**
 * @typedef {Object} Artist
 * @property {string}       id            // Spotify ID for the artist
 * @property {string}       name          // Name of the artist
 * @property {string}       uri           // Spotify URI for the artist
 * @property {string}       href          // Link to the Web API endpoint for full details
 * @property {string}       type          // Object type: 'artist'
 * @property {ExternalUrls} external_urls
 */


/**
 * @typedef {Object} Album
 * @property {string}       id           // Spotify ID for the album
 * @property {string}       name         // Name of the album
 * @property {string}       uri          // Spotify URI for the album
 * @property {string}       href         // Link to the Web API endpoint for full details
 * @property {string}       album_type   // 'album', 'single', or 'compilation'
 * @property {number}       total_tracks // Total number of tracks in the album
 * @property {string}       release_date // Release date (e.g. '1981-12', '1981-12-15')
 * @property {Artist[]}     artists      // Artists who performed the album
 * @property {Image[]}      images       // Cover art images in descending size order
 * @property {ExternalUrls} external_urls
 */


/**
 * @typedef {Object} Track
 * @property {string}       id           // Spotify ID for the track
 * @property {string}       name         // Name of the track
 * @property {string}       uri          // Spotify URI for the track
 * @property {string}       href         // Link to the Web API endpoint for full details
 * @property {number}       duration_ms  // Track length in milliseconds
 * @property {number}       disc_number  // Disc number (usually 1 unless multi-disc album)
 * @property {number}       track_number // Track number within its album disc
 * @property {boolean}      explicit     // Whether the track has explicit content
 * @property {boolean}      is_local     // Whether the track is a local file
 * @property {number}       popularity   // Popularity score (0–100)
 * @property {string|null}  preview_url  // 30-second preview MP3 URL; can be null
 * @property {Artist[]}     artists      // Artists who performed the track
 * @property {Album}        album        // Album the track belongs to
 * @property {ExternalUrls} external_urls
 */


/**
 * @typedef {Object} Owner
 * @property {string}       id            // Spotify ID for the user
 * @property {string}       href          // Link to the Web API endpoint for the user
 * @property {string}       uri           // Spotify URI for the user
 * @property {string}       type          // Object type: 'user'
 * @property {string|null}  [display_name] // Display name; can be null
 * @property {ExternalUrls} external_urls
 */


/**
 * @typedef {Object} Playlist
 * @property {string}       id            // Spotify ID for the playlist
 * @property {string}       name          // Name of the playlist
 * @property {string}       uri           // Spotify URI for the playlist
 * @property {string}       href          // Link to the Web API endpoint for full details
 * @property {string}       type          // Object type: 'playlist'
 * @property {string|null}  description   // Playlist description; null for unmodified playlists
 * @property {string}       snapshot_id   // Version identifier for the current playlist state
 * @property {boolean}      collaborative // Whether others can modify the playlist
 * @property {boolean}      public        // Whether the playlist appears on the owner's profile
 * @property {Image[]}      images        // Playlist cover art (up to 3 images, descending size)
 * @property {Owner}        owner         // User who owns the playlist
 * @property {ExternalUrls} external_urls
 * @property {Object}       items
 * @property {string}       items.href    // Link to the Web API endpoint for tracks
 * @property {number}       items.total   // Total number of tracks in the playlist
 */


/**
 * @typedef {Object} PlaylistTrackObject
 * @property {string|null} added_at      // ISO 8601 timestamp when added; can be null for very old items
 * @property {Object}      added_by      // The Spotify user who added the track
 * @property {string}      added_by.id
 * @property {string}      added_by.href
 * @property {string}      added_by.uri
 * @property {string}      added_by.type
 * @property {boolean}     is_local      // Whether this is a local file
 * @property {Track|null}  item          // Track or episode info; can be null if the track is unavailable
 */


/**
 * @typedef {Object} Device
 * @property {string|null} id                 // Unique device ID; can be null
 * @property {boolean}     is_active          // Whether this is the currently active device
 * @property {boolean}     is_private_session // Whether a private listening session is active
 * @property {boolean}     is_restricted      // Whether controlling this device is restricted via the Web API
 * @property {string}      name               // Human-readable device name (e.g. "Kitchen Speaker")
 * @property {string}      type               // Device category (e.g. 'computer', 'smartphone', 'speaker')
 * @property {number|null} volume_percent     // Current volume level (0–100); can be null
 * @property {boolean}     supports_volume    // Whether the device supports volume control
 */


/**
 * @typedef {Object} Context
 * @property {string}       type          // Context type: 'artist', 'playlist', 'album', or 'show'
 * @property {string}       href          // Link to the Web API endpoint for the context object
 * @property {string}       uri           // Spotify URI for the context
 * @property {ExternalUrls} external_urls
 */


/**
 * @typedef {Object} Actions
 * @property {boolean} [interrupting_playback]   // Whether playback can be interrupted
 * @property {boolean} [pausing]                 // Whether playback can be paused
 * @property {boolean} [resuming]                // Whether playback can be resumed
 * @property {boolean} [seeking]                 // Whether playback position can be changed
 * @property {boolean} [skipping_next]           // Whether the next track can be skipped to
 * @property {boolean} [skipping_prev]           // Whether the previous track can be skipped to
 * @property {boolean} [toggling_repeat_context] // Whether repeat context can be toggled
 * @property {boolean} [toggling_shuffle]        // Whether shuffle can be toggled
 * @property {boolean} [toggling_repeat_track]   // Whether repeat track can be toggled
 * @property {boolean} [transferring_playback]   // Whether playback can be transferred to another device
 */


module.exports = {};
