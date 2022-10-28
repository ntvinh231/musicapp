const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songTitle = $('.left-content__song-name');
const cdThumb = $('.control__left-cdthumb');
const artitName = $('.left-content__artit-name');
const toggleBtn = $('.control-toggle');
const playBtn = $('.control-play');

var apiSongs = 'https://vinhnguyen-music-api.vercel.app';
const app = {
	currentIndex: 0,
	isPlaying: false,
	songData: [],

	defineProperties: () => {
		Object.defineProperty(app, 'currentSong', {
			get: () => app.songData[app.currentIndex],
		});
	},

	getSongs: function (callback) {
		fetch(apiSongs)
			.then((reponse) => {
				return reponse.json();
			})
			.then(function (reponse) {
				app.songData = reponse;
				return app.songData;
			})
			.then(callback)
			.catch(() => alert('Error'));
	},

	renderSongs: function (songs) {
		const listSongsBlock = document.getElementById('section-list__body');
		var htmls = songs.map((song) => {
			return `
			<div class="section-list__body-item">
				<div class="body-item__checkbox">
					<i class="item__checkbox-icon fa-solid fa-music"></i>
					<input type="checkbox" class="item__checkbox-input" id="">
				</div>

				<div class="body-item__media">
					<div class="item-media__left">
						<div class="media__left-image">
							<div style="background-image: url('${song.links.images[0].url}')"></div>
						</div>
						<div class="media__left-info">
							<span class="media__left-title title-name">${song.name}</span>
							<span class="media__left-title subtitle-name">${song.author}</span>
						</div>
					</div>
					<div class="item-media__center">
						<span class="media__center-album subtitle-name">Update...</span>
					</div>
					<div class="item-media__right">
						<span class="media__center-duration subtitle-name">Update...</span>
						<i
							class="media__center-option icon-option fa-solid fa-ellipsis"></i>
					</div>
				</div>
			</div>
		`;
		});
		listSongsBlock.innerHTML = htmls.join('');
	},

	loadCurrentSong: function () {
		songTitle.textContent = app.currentSong.name;
		cdThumb.style.backgroundImage = `url(${app.currentSong.links.images[0].url})`;
		artitName.textContent = app.currentSong.author;
		audio.src = app.currentSong.url;
	},

	handleEvent: function () {
		const _this = this;

		playBtn.onclick = function () {
			if (!_this.isPlaying) audio.play();
			else audio.pause();
		};

		// audio.onplay = function () {
		// 	toggleBtn.classList.add('playing');
		// 	isPlaying = true;
		// };
	},

	start: function () {
		this.defineProperties();
		this.getSongs(this.renderSongs);
		this.handleEvent();
		this.loadCurrentSong();
	},
};
app.start();
