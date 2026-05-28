(async () => {
    const Spotify = importModule('spotify');
    const spotify = new Spotify();
    const alert = new Alert();
    const currentlyPlaying = await spotify.getCurrentlyPlaying();
    const trackUri = currentlyPlaying?.item?.uri;

    if (trackUri) {
        const playlist = await spotify.getMonthlyPlaylist();
        if (playlist) {
            const isInPlaylist = await spotify.isSongInPlaylist(playlist, trackUri);
            if (isInPlaylist) {
                alert.title = "Already in Monthly Playlist";
                alert.message = `${currentlyPlaying.item.name} is already in ${playlist.name}`;
                alert.addAction("OK");
                await alert.present();
                return;
            } else {
                const result = await spotify.addToPlaylist(playlist.id, [trackUri]);
                if (result) {
                    alert.title = "Added to Monthly Playlist";
                    alert.message = `Added ${currentlyPlaying.item.name} to ${playlist.name}`;
                    alert.addAction("OK");
                    await alert.present();
                }
            }
        }
    }
});