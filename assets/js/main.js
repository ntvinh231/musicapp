const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import { renderSongsRank } from './rank.js';
import { idfavoriteUser } from './favoriteuser.js';
import { getCookie } from './firebase.js';

const genreList = $('.genre-list');
const PLAYER_STORAGE_KEY = 'SETTING_STORAGE';

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
const persionalSongList = $('.section-list__body');
const songListRank = $('.genre-list');

var dataRank = [];
var dataFavorites = [];
var apiRank = 'https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1';

const getData = (api) => {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open('GET', api);
		request.onload = () => {
			if (request.status == 200) {
				resolve(request.response);
			} else {
				console.log(request.status);
				reject(Error(request.statusText));
			}
		};
		request.onerror = () => {
			return Error('Fetching Data Failed');
		};
		request.send();
	});
};
let i = 0;
Promise.all([getData(apiRank)])
	.then(([rank]) => {
		const localData = JSON.parse(localStorage.getItem('userData'));
		const cookieData = getCookie().userData;
		dataRank = JSON.parse(rank);
		setTimeout(() => {
			dataFavorites = JSON.parse(localStorage.getItem('dataFavorites'));
		}, 4000);
	})
	.then(() => app.start())

	.catch((err) => {
		console.log(err);
	});

const app = {
	currentIndex: 0,
	currentIndexLiked: 0,
	currentVolume: 0,
	currentSong: '',
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	isMute: false,
	clickSongAtElement: 'genre-list',
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
		currentVolume: 0,
		isPlaying: false,
		isRandom: false,
		isRepeat: false,
		isMute: false,
	},
	setConfig: function (key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},

	loadConfig: function () {
		this.isRandom = this.config.isRandom;
		this.isRepeat = this.config.isRepeat;
		this.currentVolume = this.config.currentVolume;
		this.isMute = this.config.isMute;
		this.currentIndex = this.config.currentIndex;

		// Hiển thị trạng thái bang đầu của button repeat và random
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeat);
		volumeToggle.classList.toggle('active', this.isMute);
		if (this.isMute) volumeBar.value = 0;
		else volumeBar.value = this.currentVolume * 100;
	},

	defineProperties: () => {
		if (dataFavorites) {
			Object.defineProperty(app, 'currentSong', {
				get: function () {
					return dataFavorites[app.currentIndex];
				},
			});
		}
		if (dataRank.data) {
			Object.defineProperty(app, 'currentSongRank', {
				get: function () {
					return dataRank.data.song[app.currentIndex];
				},
			});
		}
	},

	renderSongs: function () {
		const listSongsBlock = document.querySelector('.section-list__body');
		if (dataFavorites) {
			var htmls = dataFavorites.map((data, index) => {
				return `
				<div class="section-list__body-item" data-index=${index}>
					<div class="item-media__left">
						<div class="body-item__checkbox">
							<i class="item__checkbox-icon fa-solid fa-music"></i>
							<input type="checkbox" class="item__checkbox-input" id="">
						</div>
							<div class="media__left-image">
								<div class="left-image" style="background-image: url('${data.thumbnail}')"></div>
							</div>
							<div class="media__left-info">
								<span class="media__left-title title-name">${data.title}</span>
								<span class="media__left-title subtitle-name">${data.artistsNames}</span>
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
		}
	},

	loadCurrentSong: function () {
		// Khi load xong api
		if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
			songTitle.textContent = this.currentSongRank.title;
			cdThumb.style.backgroundImage = `url(${this.currentSongRank.thumbnail})`;
			artitName.textContent = this.currentSongRank.artists_names;
			audio.src = `http://api.mp3.zing.vn/api/streaming/audio/${this.currentSongRank.id}/320`;
			this.activeSong();
		} else if (this.currentSong && this.clickSongAtElement === 'section-list__body') {
			songTitle.textContent = this.currentSong.title;
			cdThumb.style.backgroundImage = `url(${this.currentSong.thumbnail})`;
			artitName.textContent = this.currentSong.artistsNames;
			audio.src = `http://api.mp3.zing.vn/api/streaming/audio/${this.currentSong.encodeId}/320`;
			$('.overview__section-slider-item').src = this.currentSong.album.thumbnail;
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
			_this.setConfig('isMute', _this.isMute);
			this.classList.toggle('active', _this.isMute);
			if (_this.isMute) {
				audio.muted = true;
				volumeBar.value = 0;
			} else {
				audio.muted = false;
				volumeBar.value = _this.currentVolume * 100;
				audio.volume = _this.currentVolume;
			}
		};
		volumeBar.onchange = function (e) {
			_this.currentVolume = e.target.value / 100;
			_this.setConfig('currentVolume', _this.currentVolume);
			audio.volume = _this.currentVolume;
			if (audio.volume === 0) {
				volumeToggle.classList.add('active');
			} else {
				_this.isMute = false;

				audio.muted = false;
				console.log(audio.volume);
				volumeToggle.classList.remove('active');
			}
		};

		toggleBtn.onclick = function () {
			if (_this.currentSongRank || this.currentSong) {
				if (!_this.isPlaying) audio.play();
				else audio.pause();
			}
			// Load when play first
			if (!_this.isMute) volumeBar.value = audio.volume * 100;
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
			_this.setConfig('isRandom', _this.isRandom);
			this.classList.toggle('active', _this.isRandom);
		};

		repeatBtn.onclick = function () {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig('isRepeat', _this.isRepeat);
			this.classList.toggle('active', _this.isRepeat);
		};

		audio.onended = function () {
			if (_this.isRepeat) {
				_this.repeatSong();
				audio.play();
			} else nextBtn.onclick();
		};

		// Persional
		persionalSongList.onclick = function (e) {
			_this.clickSongAtElement = e.target.closest('.section-list__body').className;
			const nodeImg = e.target.closest('.left-image');
			const nodeItem = e.target.closest('.section-list__body-item');
			const nodeOption = e.target.closest('.item-media__right');
			const nodeTitle = e.target.closest('.media__left-title');
			if (nodeImg || nodeTitle || (!nodeItem && !nodeOption)) {
				// console.log(_this.currentVolume);
				if (!_this.isMute) volumeBar.value = _this.currentVolume * 100;
				_this.currentIndex = Number(nodeItem.dataset.index);
				_this.loadCurrentSong();
				audio.play();
				cdThumbAnimation.play();
			}
		};
		// Rank
		songListRank.onclick = function (e) {
			const nodeItem = e.target.closest('.genre-item');
			_this.clickSongAtElement = e.target.closest('.genre-list').className;
			// Action Like
			const nodeAction = e.target.closest('.genre-item__action');
			const nodeActionLiked = e.target.closest('.genre-item__action.liked');
			if (nodeActionLiked) {
				nodeActionLiked.classList.remove('liked');
				_this.currentIndexLiked = Number(nodeItem.dataset.index);
				let idDelete = dataRank.data.song[_this.currentIndexLiked].id;
				idfavoriteUser(JSON.parse(localStorage.getItem('userDataFavorite')), idDelete);
			} else if (nodeAction || !nodeItem) {
				nodeAction.classList.add('liked');
				_this.currentIndexLiked = Number(nodeItem.dataset.index);
				// Get and Parse Data
				const userDataFavorite = JSON.parse(localStorage.getItem('userDataFavorite'));
				let idSongRank = '';
				idSongRank = dataRank.data.song[_this.currentIndexLiked].id;
				idfavoriteUser(userDataFavorite, idSongRank);
			}
			if (nodeItem && !nodeAction) {
				// Load when play first
				if (!_this.isMute) volumeBar.value = _this.currentVolume * 100;
				_this.currentIndex = Number(nodeItem.dataset.index);
				_this.loadCurrentSong();
				audio.play();
				cdThumbAnimation.play();
			}
		};
	},

	nextSong: function () {
		if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
			this.currentIndex++;
			if (this.currentIndex >= dataRank.length) this.currentIndex = 0;
			this.loadCurrentSong();
		} else if (this.currentSong && this.clickSongAtElement === 'section-list__body') {
			this.currentIndex++;
			if (this.currentIndex >= dataFavorites.length) this.currentIndex = 0;
			this.loadCurrentSong();
		}
	},

	prevSong: function () {
		if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
			this.currentIndex--;
			if (this.currentIndex < 0) this.currentIndex = dataRank.length - 1;
			this.loadCurrentSong();
		} else if (this.currentSong && this.clickSongAtElement === 'section-list__body') {
			this.currentIndex--;
			if (this.currentIndex < 0) this.currentIndex = dataFavorites.length - 1;
			this.loadCurrentSong();
		}
	},

	randomSong: function () {
		if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
			let randomNumber = Math.floor(Math.random() * dataRank.length);
			if (randomNumber >= dataRank.length) {
				randomNumber = Math.floor(Math.random() * dataRank.length);
			} else {
				this.currentIndex = randomNumber;
			}
			this.loadCurrentSong();
		} else if (this.currentSong && this.clickSongAtElement === 'section-list__body') {
			let randomNumber = Math.floor(Math.random() * dataFavorites.length);
			if (randomNumber >= dataFavorites.length) {
				randomNumber = Math.floor(Math.random() * dataFavorites.length);
			} else {
				this.currentIndex = randomNumber;
			}
			this.loadCurrentSong();
		}
	},

	repeatSong: function () {
		this.loadCurrentSong();
	},

	activeSong: function () {
		if (this.clickSongAtElement === 'section-list__body') {
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
		}
	},

	start: function () {
		this.loadConfig();
		this.defineProperties();
		// this.renderSongs();
		renderSongsRank(dataRank, genreList);
		this.loadCurrentSong();
		this.handleEvent();
	},
};
app.start();
