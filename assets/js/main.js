const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
import { firebase, auth, database } from './config.js';
import { set, ref, child, get, update } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js';
import { renderSongsRank, userDataFavorites } from './rank.js';
import { handleOption, idfavoriteUser, toastSlide } from './favoriteuser.js';
import { getCookie } from './firebase.js';
// import axios from 'axios';

const genreList = $('.genre-list');
const PLAYER_STORAGE_KEY = 'SETTING_STORAGE';
const modal = $('.modal');
const modalOverlay = $('.modal__overlay');
const loginForm = $('.auth-form--login');
const registerForm = $('.auth-form--register');
const PlayAll = $('.overview__content-right');
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
const songListsRelease = $$('.new-release__multiline-wrapper');
const localData = JSON.parse(localStorage.getItem('userData'));
const cookieData = getCookie().userData;
// const test = document.querySelectorAll('.genre-item__play-icon');
// console.log(test);

var dataFavorites = [];
var dataRank = [];
var apiRank = 'https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1';
var dataReleases = [];
let dataReleaseAll = [];
let dataReleaseVPOP = [];
let dataReleaseOthers = [];
var apiRelease = 'https://apizingmp3.vercel.app/api/home?page=1';

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
Promise.all([getData(apiRank), getData(apiRelease)])
	.then(([rank, release]) => {
		dataRank = JSON.parse(rank);
		setTimeout(() => {
			dataFavorites = JSON.parse(localStorage.getItem('dataFavorites'));
		}, 4000);
		dataReleases = JSON.parse(release);
	})
	.then(() => app.start())

	.catch((err) => {
		console.log(err);
	});

export function download(url, filename) {
	axios
		.get(url)
		.then((response) =>
			fetch(response.data.url)
				.then((response) => response.blob())
				.then((blob) => {
					const link = document.createElement('a');
					link.type = 'audio/mpeg';
					link.href = URL.createObjectURL(blob);
					link.download = filename;
					link.click();
				})
		)

		.catch(function (err) {
			console.info(err + ' url: ' + url);
		});
}

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
		if ((dataFavorites && cookieData) || localData) {
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
		if (dataReleases.data) {
			dataReleaseAll = dataReleases.data.items[3].items.vPop;
			Object.defineProperty(app, 'currentReleaseAll', {
				get: function () {
					return dataReleases.data.items[3].items.all[app.currentIndex];
				},
			});
			dataReleaseVPOP = dataReleases.data.items[3].items.vPop;
			Object.defineProperty(app, 'currentReleaseVPOP', {
				get: function () {
					return dataReleases.data.items[3].items.vPop[app.currentIndex];
				},
			});
			dataReleaseOthers = dataReleases.data.items[3].items.others;
			Object.defineProperty(app, 'currentReleaseOthers', {
				get: function () {
					return dataReleases.data.items[3].items.others[app.currentIndex];
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
		// Load when play first
		if (!this.isMute) {
			volumeBar.value = this.currentVolume * 100;
		} else {
			audio.volume = 0;
		}
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
		} else if (this.currentReleaseAll && this.clickSongAtElement === 'new-release__multiline-wrapper-0') {
			if (this.currentReleaseAll.streamingStatus === 2) {
				alert('Bạn không phải là VIP');
			} else {
				songTitle.textContent = this.currentReleaseAll.title;
				cdThumb.style.backgroundImage = `url(${this.currentReleaseAll.thumbnail})`;
				artitName.textContent = this.currentReleaseAll.artistsNames;
				audio.src = `http://api.mp3.zing.vn/api/streaming/audio/${this.currentReleaseAll.encodeId}/320`;
				this.activeSong();
			}
		} else if (this.currentReleaseVPOP && this.clickSongAtElement === 'new-release__multiline-wrapper-1') {
			if (this.currentReleaseVPOP.streamingStatus === 2) {
				alert('Bạn không phải là VIP');
			} else {
				songTitle.textContent = this.currentReleaseVPOP.title;
				cdThumb.style.backgroundImage = `url(${this.currentReleaseVPOP.thumbnail})`;
				artitName.textContent = this.currentReleaseVPOP.artistsNames;
				audio.src = `http://api.mp3.zing.vn/api/streaming/audio/${this.currentReleaseVPOP.encodeId}/320`;
				this.activeSong();
			}
		} else if (this.currentReleaseOthers && this.clickSongAtElement === 'new-release__multiline-wrapper-2') {
			if (this.currentReleaseOthers.streamingStatus === 2) {
				alert('Bạn không phải là VIP');
			} else {
				songTitle.textContent = this.currentReleaseOthers.title;
				cdThumb.style.backgroundImage = `url(${this.currentReleaseOthers.thumbnail})`;
				artitName.textContent = this.currentReleaseOthers.artistsNames;
				audio.src = `http://api.mp3.zing.vn/api/streaming/audio/${this.currentReleaseOthers.encodeId}/320`;
				this.activeSong();
			}
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
			if (!_this.isMute) volumeBar.value = _this.currentVolume * 100;
		};

		audio.onplay = function () {
			toggleBtn.classList.add('playing');
			if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
				toggleBtnRank.classList.add('playing');
			}
			_this.isPlaying = true;
			cdThumbAnimation.play();
		};

		// Khi song bị pause
		audio.onpause = function () {
			toggleBtn.classList.remove('playing');
			if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
				toggleBtnRank.classList.remove('playing');
			}
			_this.isPlaying = false;
			cdThumbAnimation.pause();
		};

		progress.oninput = function (e) {
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

		PlayAll.onclick = () => {
			if (this.currentSong && this.clickSongAtElement === 'section-list__body') {
				this.currentIndex = 0;
				this.loadCurrentSong();
				audio.play();
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
			if (e.target.closest('.section-list__body')) {
				_this.clickSongAtElement = e.target.closest('.section-list__body').className;
			}
			const nodeImg = e.target.closest('.left-image');
			const nodeItem = e.target.closest('.section-list__body-item');
			const nodeOption = e.target.closest('.item-media__right');
			const nodeTitle = e.target.closest('.media__left-title');
			if (nodeImg || nodeTitle || (!nodeItem && !nodeOption)) {
				_this.currentIndex = Number(nodeItem.dataset.index);
				_this.loadCurrentSong();
				audio.play();

				cdThumbAnimation.play();
			} else if (nodeOption) {
				handleOption(Number(nodeItem.dataset.index));
			}
		};

		// Release
		songListsRelease.forEach((songListRelease, index) => {
			songListRelease.onclick = function (e) {
				_this.clickSongAtElement = e.target.closest('.new-release__multiline-wrapper').className + `-${index}`;
				const nodeImg = e.target.closest('.media-left__thumb-img');
				const nodeItem = e.target.closest('.new-release__multiline-item');
				const nodeOption = e.target.closest('.multiline-item__media-right');
				const nodeTitle = e.target.closest('.media-left__info-name');
				const nodeTime = e.target.closest('.media-left__time-release');

				if (nodeImg || (!nodeItem && !nodeOption && !nodeTitle && !nodeTime)) {
					if (!_this.isMute) volumeBar.value = _this.currentVolume * 100;
					_this.currentIndex = Number(nodeItem.dataset.index);
					_this.loadCurrentSong();
					audio.play();
					cdThumbAnimation.play();
				}
				// else if (nodeOption) {
				// 	handleOption(Number(nodeItem.dataset.index));
				// }
			};
		});

		// Rank
		songListRank.onclick = function (e) {
			const nodeItem = e.target.closest('.genre-item');
			_this.clickSongAtElement = e.target.closest('.genre-list').className;
			const nodeAction = e.target.closest('.genre-item__action');
			const nodeActionLiked = e.target.closest('.genre-item__action.liked');
			// Action Like
			if (nodeActionLiked) {
				nodeActionLiked.classList.remove('liked');
				_this.currentIndexLiked = Number(nodeItem.dataset.index);
				let idDelete = dataRank.data.song[_this.currentIndexLiked].id;
				idfavoriteUser(JSON.parse(localStorage.getItem('userDataFavorite')), idDelete);
			} else if (nodeAction || !nodeItem) {
				if (localData || cookieData) {
					nodeAction.classList.add('liked');
					_this.currentIndexLiked = Number(nodeItem.dataset.index);
					// Get and Parse Data
					const userDataFavorite = JSON.parse(localStorage.getItem('userDataFavorite'));
					let idSongRank = '';
					idSongRank = dataRank.data.song[_this.currentIndexLiked].id;
					idfavoriteUser(userDataFavorite, idSongRank);
				} else {
					modal.classList.add('active');
					modalOverlay.classList.add('active');
					$('.modal__body').style.display = 'block';
					loginForm.style.display = 'block';
					registerForm.style.display = 'none';
				}
			}
			if (nodeItem && !nodeAction) {
				_this.currentIndex = Number(nodeItem.dataset.index);
				_this.loadCurrentSong();
				audio.play();
				cdThumbAnimation.play();
			}
		};
		// Current Song
		// if (
		// 	this.currentSongRank ||
		// 	this.currentSong ||
		// 	this.currentReleaseAll ||
		// 	this.currentReleaseVPOP ||
		// 	this.currentReleaseOthers
		// ) {
		// 	if (
		// 		localData ||
		// 		(cookieData &&
		// 			userDataFavorites.favorites_music.includes(this.currentSongRank.id) &&
		// 			userDataFavorites.favorites_music.includes(this.currentSong.id) &&
		// 			userDataFavorites.favorites_music.includes(this.currentReleaseAll.id) &&
		// 			userDataFavorites.favorites_music.includes(this.currentReleaseVPOP.id) &&
		// 			userDataFavorites.favorites_music.includes(this.currentReleaseOthers.id))
		// 	) {
		// 		$('.current-item__action').classList.add('liked');
		// 	} else {
		// 		if ($('.current-item__action.liked')) {
		// 			$('.current-item__action.liked').classList.remove('liked');
		// 		}
		// 	}
		// }
		$('.current-item__action').onclick = (e) => {
			if (this.currentSongRank) {
				this.addLikedFavorite(JSON.parse(localStorage.getItem('userDataFavorite')), this.currentSongRank.id);
			} else if (this.currentSong) {
				this.addLikedFavorite(JSON.parse(localStorage.getItem('userDataFavorite')), this.currentSong.id);
			} else if (this.currentReleaseAll) {
				this.addLikedFavorite(JSON.parse(localStorage.getItem('userDataFavorite')), this.currentReleaseAll.id);
			} else if ((JSON.parse(localStorage.getItem('userDataFavorite')), this.currentReleaseVPOP)) {
				this.addLikedFavorite(this.currentReleaseVPOP.id);
			} else if (this.currentReleaseOthers) {
				this.addLikedFavorite(JSON.parse(localStorage.getItem('userDataFavorite')), this.currentSongRank.id);
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
		} else if (this.currentReleaseAll && this.clickSongAtElement === 'new-release__multiline-wrapper-0') {
			this.currentIndex++;
			if (this.currentIndex >= dataReleaseAll.length) this.currentIndex = 0;
			this.loadCurrentSong();
		} else if (this.currentReleaseVPOP && this.clickSongAtElement === 'new-release__multiline-wrapper-1') {
			this.currentIndex++;
			if (this.currentIndex >= dataReleaseVPOP.length) this.currentIndex = 0;
			this.loadCurrentSong();
		} else if (this.currentReleaseOthers && this.clickSongAtElement === 'new-release__multiline-wrapper-2') {
			this.currentIndex++;
			if (this.currentIndex >= dataReleaseOthers.length) this.currentIndex = 0;
			this.loadCurrentSong();
		}
	},

	prevSong: function () {
		if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
			this.currentIndex--;
			if (this.currentIndex < 0) this.currentIndex = dataRank.rank.song.length - 1;
			this.loadCurrentSong();
		} else if (this.currentSong && this.clickSongAtElement === 'section-list__body') {
			this.currentIndex--;
			if (this.currentIndex < 0) this.currentIndex = dataFavorites.length - 1;
			this.loadCurrentSong();
		} else if (this.currentReleaseAll && this.clickSongAtElement === 'new-release__multiline-wrapper-0') {
			this.currentIndex--;
			if (this.currentIndex < 0) this.currentIndex = dataReleaseAll.length - 1;
			this.loadCurrentSong();
		} else if (this.currentReleaseVPOP && this.clickSongAtElement === 'new-release__multiline-wrapper-1') {
			this.currentIndex--;
			if (this.currentIndex < 0) this.currentIndex = dataReleaseVPOP.length - 1;
			this.loadCurrentSong();
		} else if (this.currentReleaseOthers && this.clickSongAtElement === 'new-release__multiline-wrapper-2') {
			this.currentIndex--;
			if (this.currentIndex < 0) this.currentIndex = dataReleaseOthers.length - 1;
			this.loadCurrentSong();
		}
	},

	randomSong: function () {
		if (this.currentSongRank && this.clickSongAtElement === 'genre-list') {
			let randomNumber = Math.floor(Math.random() * dataRank.data.song.length);
			1;
			if (randomNumber >= dataRank.data.song.length) {
				randomNumber = Math.floor(Math.random() * dataRank.data.song.length);
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
		} else if (this.currentReleaseAll && this.clickSongAtElement === 'new-release__multiline-wrapper-0') {
			let randomNumber = Math.floor(Math.random() * dataReleaseAll.length);
			if (randomNumber >= dataReleaseAll.length) {
				randomNumber = Math.floor(Math.random() * dataReleaseAll.length);
			} else {
				this.currentIndex = randomNumber;
			}
			this.loadCurrentSong();
		} else if (this.currentReleaseVPOP && this.clickSongAtElement === 'new-release__multiline-wrapper-1') {
			let randomNumber = Math.floor(Math.random() * dataReleaseVPOP.length);
			if (randomNumber >= dataReleaseVPOP.length) {
				randomNumber = Math.floor(Math.random() * dataReleaseVPOP.length);
			} else {
				this.currentIndex = randomNumber;
			}
			this.loadCurrentSong();
		} else if (this.currentReleaseOthers && this.clickSongAtElement === 'new-release__multiline-wrapper-2') {
			let randomNumber = Math.floor(Math.random() * dataReleaseOthers.length);
			if (randomNumber >= dataReleaseOthers.length) {
				randomNumber = Math.floor(Math.random() * dataReleaseOthers.length);
			} else {
				this.currentIndex = randomNumber;
			}
			this.loadCurrentSong();
		}
	},

	repeatSong: function () {
		this.loadCurrentSong();
	},

	addLikedFavorite: function (userDataFavorite, id) {
		if (localData || cookieData) {
			// check data exists
			if (Array.isArray(userDataFavorite.favorites_music)) {
				if (!userDataFavorite.favorites_music.includes(id)) {
					console.log(id);
					userDataFavorite.favorites_music.push(id);
					setTimeout(() => {
						toastSlide();
					}, 1200);
				} else {
					alert('Bài hát đã có trong danh sách');
				}
			} else {
				userDataFavorite.favorites_music = [`${id}`];
			}
			localStorage.setItem('userDataFavorite', JSON.stringify(userDataFavorite));
			update(ref(database, 'users/' + userDataFavorite.userUid), {
				favorites_music: userDataFavorite.favorites_music,
			});
		} else {
			modal.classList.add('active');
			modalOverlay.classList.add('active');
			$('.modal__body').style.display = 'block';
			loginForm.style.display = 'block';
			registerForm.style.display = 'none';
			$('.genre-item__action.liked').classList.remove('liked');
		}
	},

	activeSong: function () {
		const songs = $$('.section-list__body-item');
		const songsRank = $$('.genre-item__play');
		const songsRelease = $$('.new-release__multiline-item');
		if (this.clickSongAtElement === 'section-list__body') {
			songs.forEach((song, index) => {
				if (index == this.currentIndex) {
					song.classList.add('active');
					// Remove active Others
					for (let i = 0; i < songsRank.length; i++) {
						songsRank[i].setAttribute('class', 'genre-item__play');
					}
					for (let i = 0; i < songsRelease.length; i++) {
						songsRelease[i].setAttribute('class', 'new-release__multiline-item');
					}
					songsRelease;
					setTimeout(() => {
						song.scrollIntoView({
							behavior: 'smooth',
							block: 'nearest',
						});
					}, 300);
				} else {
					song.classList.remove('active');
				}
			});
		} else if (this.clickSongAtElement === 'genre-list') {
			songsRank.forEach((songRank, index) => {
				if (index == this.currentIndex) {
					songRank.classList.add('playing');
					// Remove active Others
					for (let i = 0; i < songs.length; i++) {
						songs[i].setAttribute('class', 'section-list__body-item');
					}
					for (let i = 0; i < songsRelease.length; i++) {
						songsRelease[i].setAttribute('class', 'new-release__multiline-item');
					}
				} else songRank.classList.remove('playing');
			});
		} else if (this.clickSongAtElement.includes(`new-release__multiline-wrapper`)) {
			// Remove active Others
			for (let i = 0; i < songsRank.length; i++) {
				songsRank[i].setAttribute('class', 'genre-item__play');
			}
			for (let i = 0; i < songs.length; i++) {
				songs[i].setAttribute('class', 'section-list__body-item');
			}
			if (this.clickSongAtElement === `new-release__multiline-wrapper-0`) {
				songsRelease.forEach((song, index) => {
					if (index == this.currentIndex) {
						song.classList.add('active');
						setTimeout(() => {
							song.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
							});
						}, 300);
					} else {
						song.classList.remove('active');
					}
				});
			} else if (this.clickSongAtElement === `new-release__multiline-wrapper-1`) {
				songsRelease.forEach((song, index) => {
					if (index == this.currentIndex + dataReleaseVPOP.length) {
						song.classList.add('active');
						setTimeout(() => {
							song.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
							});
						}, 300);
					} else {
						song.classList.remove('active');
					}
				});
			} else if (this.clickSongAtElement === `new-release__multiline-wrapper-2`) {
				songsRelease.forEach((song, index) => {
					if (index == this.currentIndex + dataReleaseOthers.length * 2) {
						song.classList.add('active');
						setTimeout(() => {
							song.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
							});
						}, 300);
					} else {
						song.classList.remove('active');
					}
				});
			}
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
