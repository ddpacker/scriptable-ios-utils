const Spotify = importModule('spotify');

const spotify = new Spotify();
await spotify.login();

const userInfo = await spotify.getUserInfo();

const alert = new Alert();

alert.title = `Login Successful #${userInfo.id}`;
alert.message = `Welcome, ${userInfo.display_name}!`;

await alert.present();