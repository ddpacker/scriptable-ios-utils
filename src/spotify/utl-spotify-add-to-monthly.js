// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
async function run() {
    const Spotify = importModule('spotify');
    const spotify = new Spotify();
    
    try {
        const track = await spotify.getCurrentlyPlaying();
        
        if (!track) throw new Error("There is no track currently playing");
        
        const playlist = await spotify.getMonthlyPlaylist();
        
        if (!playlist) throw new Error("Monthly playlist doesn't exist");
        
        const playlistItems = await spotify.getPlaylistItems(playlist.id);
        
        const hasItem = playlistItems.includes(track.uri);
        
        if (hasItem) throw new Error(`${track.name} is already in your monthly playlist for ${playlist.name}`);
        
        const addedToMonthly = await spotify.addToPlaylist(playlist.id, [track.uri]);
        
        if (!addedToMonthly) throw new Error(`Couldn't add ${track.name} to ${playlist.name}`);
        
        return `Successfully added ${track.name} to ${playlist.name}`
        
    } catch (e) {
        return e.message;
    };
};

await run().then((out) => {
    console.log(out);
    Script.setShortcutOutput(out);
    Script.complete()
});