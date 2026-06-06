// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
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
        
        const addedToMonthly = await _spotify.addToPlaylist(playlist.id, { uris: track.uri });
        if (!addedToMonthly) throw new Error(`Couldn't add ${track.name} to ${playlist.name}`);

        const addedToLibrary = await _spotify.saveToLibrary({ uris: track.uri });
            
        return `Successfully added ${track.name} to ${playlist.name} ${addedToLibrary ? 'and your library!' : 'but it was already in your library!'}`;
        
        
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