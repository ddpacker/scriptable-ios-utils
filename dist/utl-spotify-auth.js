(async () => {
    const Spotify = importModule('spotify');
    const spotify = new Spotify();
    await spotify.login();
});