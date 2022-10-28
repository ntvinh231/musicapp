const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songTitle = $('.left-content__song-name');
const cdThumb = $('.control__left-cdthumb');
const artitName = $('.left-content__artit-name');
const toggleBtn = $('.control-toggle');
const nextBtn = $('.control-next');
const prevBtn = $('.control-prev');

var apiSongs = 'https://vinhnguyen-music-api.vercel.app';

var songData = [];

fetch(apiSongs)
	.then((reponse) => {
		return reponse.json();
	})
	.then(function (reponse) {
		songData = reponse;
		console.log(songData);
		// console.log(reponse );
	})
	.catch(() => alert('Error'));

const app = {
	songs: [...songData],
	currentIndex: 0,
	isPlaying: false,
	// songData: songDatas,

	defineProperties: () => {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return app.songs[this.currentIndex];
			},
		});
	},

	renderSongs: function () {
		const listSongsBlock = document.getElementById('section-list__body');
		var htmls = app.songs.map((song) => {
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

	loadCurrentSong: function (songs) {
		songTitle.textContent = songs[app.currentIndex].name;
		cdThumb.style.backgroundImage = `url(${songs[app.currentIndex].links.images[0].url})`;
		artitName.textContent = songs[app.currentIndex].author;
		audio.src = songs[app.currentIndex].url;
	},

	handleEvent: function () {
		const _this = this;

		const cbThumbAnimation = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
			duration: 10000,
			iterations: Infinity,
		});
		cbThumbAnimation.pause();

		toggleBtn.onclick = function () {
			if (!_this.isPlaying) audio.play();
			else audio.pause();
		};

		audio.onplay = function () {
			toggleBtn.classList.add('playing');
			_this.isPlaying = true;
			cbThumbAnimation.play();
		};

		// Khi song bị pause
		audio.onpause = function () {
			toggleBtn.classList.remove('playing');
			_this.isPlaying = false;
			cbThumbAnimation.pause();
		};

		nextBtn.onclick = function () {
			_this.loadCurrentSong();
		};
	},

	// nextSong: function() {
	// 	this.currentIndex++
	// 	if(this.currentIndex >= this.)
	// }

	start: function () {
		// this.getSongs(this.loadCurrentSong);
		// this.getSongs(this.renderSongs);
		// this.loadCurrentSong()
		this.defineProperties();
		this.renderSongs();
		this.handleEvent();
		// this.loadCurrentSong();
	},
};
app.start();
