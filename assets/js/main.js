const $ = document.querySelector.bind(this);
const $$ = document.querySelectorAll.bind(this);

var api = 'https://music-api-tau-two.vercel.app/songs.json';

fetch(api)
	.then((reponse) => reponse.json())
	.then((reponse) => console.log(reponse));
