// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
(async () => {
    const Spotify = importModule('spotify');
    const _spotify = new Spotify();
    await _spotify.login();
})();