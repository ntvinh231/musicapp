const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songTitle = $('.left-content__song-name');
const cdThumb = $('.control__left-cdthumb');
const artitName = $('.left-content__artit-name');
const toggleBtn = $('.control-toggle');
const nextBtn = $('.control-next');
const prevBtn = $('.control-prev');
const randomBtn = $('.control-random');
const repeatBtn = $('.control-repeat');
const progress = $('#progress');
const volumeToggle = $('.volume-change');
const volumeBar = $('.volume');
const playList = $('.section-list__body');

var songData = [];

var apiSongs = 'https://vinhnguyen-music-api.vercel.app';

// var getData = (api) => {
// 	return new Promise((resolve, reject) => {
// 		var request = new XMLHttpRequest();
// 		request.open('GET', api);
// 		request.onload = () => {
// 			if (request.status == 200) {
// 				resolve(request.response);
// 			} else {
// 				reject(Error(request.statusText));
// 			}
// 		};
// 		request.onerror = () => {
// 			return Error('Failed');
// 		};
// 		request.send();
// 	});
// };

getData = (api) => {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open('GET', api);
		request.onload = () => {
			if (request.status == 200) {
				resolve(request.response);
			} else {
				reject(Error(request.statusText));
			}
		};
		request.onerror = () => {
			return Error('Fetching Data Failed');
		};
		request.send();
	});
};
// Promise.all(getData(apiSongs))
// 	.then(([songs]) => {s
// 		songData = JSON.parse(songs);
// 	})
// 	.then(() => app.start());

Promise.all([getData(apiSongs)])
	.then(([songs]) => {
		songData = JSON.parse(songs);
	})
	.then(() => app.start())
	.catch((err) => alert(err));

const app = {
	currentIndex: 0,
	currentVolume: 0,
	previousVolume: 0,
	isPlaying: false,
	isPlaying2: false,
	currentSong: '',
	isRandom: false,
	isRepeat: false,
	isMute: false,

	defineProperties: () => {
		Object.defineProperty(app, 'currentSong', {
			get: function () {
				return songData[app.currentIndex];
			},
		});
	},
	renderSongs: function () {
		const listSongsBlock = document.querySelector('.section-list__body');
		var htmls = songData.map((song, index) => {
			return `
			<div class="section-list__body-item" data-index=${index}>
				<div class="item-media__left">
					<div class="body-item__checkbox">
						<i class="item__checkbox-icon fa-solid fa-music"></i>
						<input type="checkbox" class="item__checkbox-input" id="">
					</div>
						<div class="media__left-image">
							<div class="left-image" style="background-image: url('${song.links.images[0].url}')"></div>
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
		`;
		});
		listSongsBlock.innerHTML = htmls.join('');
	},

	loadCurrentSong: function () {
		// Khi load xong api
		if (this.currentSong) {
			songTitle.textContent = this.currentSong.name;
			cdThumb.style.backgroundImage = `url(${this.currentSong.links.images[0].url})`;
			artitName.textContent = this.currentSong.author;
			audio.src = this.currentSong.url;
			this.activeSong();
		}
	},

	handleEvent: function () {
		const _this = this;

		const cdThumbAnimation = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
			duration: 10000,
			iterations: Infinity,
		});
		cdThumbAnimation.pause();

		// Control
		volumeToggle.onclick = function () {
			_this.isMute = !_this.isMute;
			this.classList.toggle('active', _this.isMute);
			if (_this.isMute) {
				audio.muted = true;
				_this.previousVolume = volumeBar.value / 100;
				volumeBar.value = 0;
			} else {
				audio.muted = false;
				volumeBar.value = _this.previousVolume * 100;
			}
		};
		volumeBar.onchange = function (e) {
			_this.currentVolume = e.target.value / 100;
			audio.volume = _this.currentVolume;
		};

		toggleBtn.onclick = function () {
			if (_this.currentSong) {
				if (!_this.isPlaying) audio.play();
				else audio.pause();
			}
		};

		audio.onplay = function () {
			toggleBtn.classList.add('playing');
			_this.isPlaying = true;
			cdThumbAnimation.play();
		};

		// Khi song bị pause
		audio.onpause = function () {
			toggleBtn.classList.remove('playing');
			_this.isPlaying = false;
			cdThumbAnimation.pause();
		};

		progress.onchange = function (e) {
			const seekTime = (audio.duration / 100) * e.target.value;
			audio.currentTime = seekTime;
			audio.play();
		};

		audio.ontimeupdate = function () {
			if (audio.duration) {
				const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
				progress.value = progressPercent;
				// console.log('Progress Percent: ', progressPercent);
				// console.log('Current Time: ', Math.floor(audio.currentTime));
			}
		};

		nextBtn.onclick = function () {
			if (_this.isRandom) _this.randomSong();
			else _this.nextSong();
			audio.play();
		};

		prevBtn.onclick = function () {
			if (_this.isRandom) _this.randomSong();
			else _this.prevSong();
			audio.play();
		};

		randomBtn.onclick = function () {
			_this.isRandom = !_this.isRandom;
			this.classList.toggle('active', _this.isRandom);
		};

		repeatBtn.onclick = function () {
			_this.isRepeat = !_this.isRepeat;
			this.classList.toggle('active', _this.isRepeat);
		};

		audio.onended = function () {
			if (_this.isRepeat) {
				_this.repeatSong();
				audio.play();
			} else nextBtn.onclick();
		};

		playList.onclick = function (e) {
			const nodeImg = e.target.closest('.left-image');
			const node = e.target.closest('.section-list__body-item');
			const nodeOption = e.target.closest('.item-media__right');
			const nodeTitle = e.target.closest('.media__left-title');
			if (nodeImg || nodeTitle || (!node && !nodeOption)) {
				_this.currentIndex = Number(node.dataset.index);
				_this.loadCurrentSong();
				audio.play();
				cdThumbAnimation.play();
			}
		};
	},

	nextSong: function () {
		this.currentIndex++;
		if (this.currentIndex >= songData.length) this.currentIndex = 0;
		this.loadCurrentSong();
	},

	prevSong: function () {
		this.currentIndex--;
		if (this.currentIndex < 0) this.currentIndex = songData.length - 1;
		this.loadCurrentSong();
	},

	randomSong: function () {
		let randomNumber = Math.floor(Math.random() * 100);
		if (randomNumber >= songData.length) {
			randomNumber = Math.floor(Math.random() * 100);
		} else {
			this.currentIndex = randomNumber;
		}
		this.loadCurrentSong();
	},

	repeatSong: function () {
		this.loadCurrentSong();
	},

	activeSong: function () {
		const songs = $$('.section-list__body-item');
		songs.forEach((song, index) => {
			if (index == this.currentIndex) {
				song.classList.add('active');
				setTimeout(() => {
					song.scrollIntoView({
						behavior: 'smooth',
						block: 'nearest',
					});
				}, 300);
			} else song.classList.remove('active');
		});
	},

	start: function () {
		this.defineProperties();
		this.renderSongs();
		this.loadCurrentSong();
		this.handleEvent();
	},
};
app.start();
