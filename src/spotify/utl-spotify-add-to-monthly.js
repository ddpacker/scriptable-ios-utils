// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
import { DuplicateError } from '../lib/errors.js';

async function run() {

    const Spotify = importModule('spotify');
    /** @typedef {import('../lib/spotify.js')} Spotify */
    /** @type {Spotify} */
    const _spotify = new Spotify();
    
    try {
        const track = (await _spotify.getCurrentlyPlaying())?.item;
        if (!track) throw new Error("There is no track currently playing");
        
        const playlist = (await _spotify.getMonthlyPlaylist());
        if (!playlist) throw new Error("Monthly playlist doesn't exist");
        
        const [playlistError, libraryError] = await Promise.all([
            _spotify.addToPlaylist(playlist, track).then(() => null).catch(e => e),
            _spotify.saveToLibrary(track).then(() => null).catch(e => e),
        ])

        const playlistDuplicate = playlistError instanceof DuplicateError;
        const libraryDuplicate = libraryError instanceof DuplicateError;
                
        if (playlistDuplicate && libraryDuplicate) throw new DuplicateError(`${track.name} already added to ${playlist.name} and your library!`);
        if (playlistError && libraryError) throw new Error(`Failed to save to ${playlist.name} and your library!`)
        if (playlistError && libraryDuplicate) throw new Error (`${track.name} is already in your library, but couldn't be added to ${playlist.name}`);
        if (libraryError && playlistDuplicate) throw new Error (`${track.name} is already in ${playlist.name}, but couldn't be added to your library`);
        if (libraryError) return `Successfully added ${track.name} to ${playlist.name}!`
        if (playlistError) return `Successfully added ${track.name} to your library!`
        return `Successfully added ${track.name} to ${playlist.name} and your library!`
    } catch (e) {
        if (e instanceof Error) {
            return e.message;
        }
        return "An unknown error occurred";
    }
};

// @ts-ignore
await run().then((out) => {
    console.log(out);
    Script.setShortcutOutput(out);
});