// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;


(async () => {
    const Spotify = importModule('spotify');
    const spotify = new Spotify();
    await spotify.login();
    const userInfo = await spotify.getUserInfo();
})();