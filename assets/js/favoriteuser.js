const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const genreList = $('.genre-list');
import { firebase, auth, database } from './config.js';
import { getCookie } from './firebase.js';
import { set, ref, child, get, update } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js';
import { artistInfo } from './artistsinfo.js';
import { timeFormat } from './format/timeFormat.js';
import { download } from './main.js';

const localData = JSON.parse(localStorage.getItem('userData'));
const cookieData = getCookie().userData;
const userDataFavorites = JSON.parse(localStorage.getItem('userDataFavorite'));

let useData = [];
// Add Song Favorite in list

export const idfavoriteUser = (userDataFavorite, idSongRank) => {
	if (localData || cookieData) {
		// check data exists
		if (Array.isArray(userDataFavorite.favorites_music)) {
			if (userDataFavorite.favorites_music.includes(idSongRank)) {
				var index = userDataFavorite.favorites_music.indexOf(idSongRank);
				// Get Index and Delete
				if (index !== -1) {
					userDataFavorite.favorites_music.splice(index, 1);
					if (userDataFavorite.favorites_music.length == 0) localStorage.removeItem('dataFavorites');
				}
			} else {
				userDataFavorite.favorites_music.push(idSongRank);
				setTimeout(() => {
					toastSlide();
				}, 1200);
			}
		} else {
			userDataFavorite.favorites_music = [`${idSongRank}`];
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
};

export const handleRender = () => {
	if (userDataFavorites) {
		userDataFavorites.favorites_music.forEach((id, index) => {
			artistInfo(id);
			const getMusic = async () => {
				try {
					let data = await axios.get(`https://apizingmp3.vercel.app/api/infosong?id=${id}`);
					useData.splice(index, 0, data.data.data);
					if (useData.length === userDataFavorites.favorites_music.length) {
						localStorage.setItem('dataFavorites', JSON.stringify(useData));
						render(useData);
					}
				} catch (e) {
					console.log(e);
				}
			};
			getMusic();
		});
	}
};
handleRender();

export const toastSlide = () => {
	const toatMain = document.querySelector('#toast');
	if (toatMain) {
		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.innerHTML = `
			<div class="toast__item">
				<i class="fa-solid fa-circle-exclamation"></i>
				<span>Đã Thêm Bài Hát Vào Danh Sách</span>
			</div>
		`;
		toatMain.appendChild(toast);
		setTimeout(function () {
			toatMain.removeChild(toast);
		}, 3000 + 2000);
	}
};

export const toastUpdate = () => {
	const toatMain = document.querySelector('#toast');
	if (toatMain) {
		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.innerHTML = `
						<div class="toast__item">
							<i class="fa-solid fa-circle-exclamation"></i>
							<span>Chức năng đang phát triển, vui lòng thử lại sau</span>
						</div>
					`;
		toatMain.appendChild(toast);
		setTimeout(function () {
			toatMain.removeChild(toast);
		}, 3000 + 2000);
	}
};

export const toastDelete = (name) => {
	const toatMain = document.querySelector('#toast');
	if (toatMain) {
		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.innerHTML = `
						<div class="toast__item">
							<i class="fa-solid fa-circle-exclamation"></i>
							<span>Đã xóa bài hát ${name} khỏi danh sách</span>
						</div>
					`;
		toatMain.appendChild(toast);
		setTimeout(function () {
			toatMain.removeChild(toast);
		}, 3000 + 2000);
	}
};

export const render = (useData) => {
	if (useData) {
		const listSongsBlock = document.querySelector('.section-list__body');
		var htmls = useData.map((data, index) => {
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
				<span class="media__center-album subtitle-name">${data.album.title}</span>
			</div>
				<div class="item-media__right">
					<span class="media__right-duration subtitle-name">${timeFormat(data.duration)}</span>
					<i
					class="media__right-option icon-option fa-solid fa-ellipsis"></i>
					<div class="media__right-option-menu">
						<ul class="media__right-option-list">
							<li class="option-delete media__right-option-item">Xoá Bài Hát Khỏi Danh Sách</li>
							<li class="option-download media__right-option-item">Tải Bài Hát Về Máy</li>
							<li class="media__right-option-item">Update</li>
							<li class="media__right-option-item">Update</li>
							<li class="media__right-option-item">Update</li>
							<li class="media__right-option-item">Update</li>
						</ul>
					</div>
			</div>
		</div>
	`;
		});
		listSongsBlock.innerHTML = htmls.join('');
	}
};

let flag = false;
export const handleOption = (optionIndex) => {
	const optionMenu = $$('.media__right-option-menu');
	const optionItemDelete = $$('.option-delete');
	const optionDownLoads = $$('.option-download');
	const dataFavorites = JSON.parse(localStorage.getItem('dataFavorites'));
	optionMenu.forEach((item, index) => {
		if (index === optionIndex) {
			flag = !flag;
			item.classList.toggle('active', flag);
			optionItemDelete[index].onclick = () => {
				if (userDataFavorites.favorites_music.includes(dataFavorites[index].encodeId)) {
					let indexOf = userDataFavorites.favorites_music.indexOf(dataFavorites[index].encodeId);
					// Get Index and Delete
					if (indexOf !== -1) {
						userDataFavorites.favorites_music.splice(indexOf, 1);
						// Delete action liked in Rank
						$$('.genre-item').forEach((item, index) => {
							const genre_NameSong = $$('.genre-item__info-name')[index];
							const genre_NameArtist = $$('.genre-item__info-artist-name')[index];
							if (
								genre_NameSong.textContent == dataFavorites[indexOf].title &&
								genre_NameArtist.textContent == dataFavorites[indexOf].artistsNames
							) {
								$$('.genre-item__action')[index].classList.remove('liked');
							}
						});
						dataFavorites.splice(indexOf, 1);
						if (userDataFavorites.favorites_music.length == 0) {
							localStorage.removeItem('dataFavorites');
						}
					}
				}

				localStorage.setItem('userDataFavorite', JSON.stringify(userDataFavorites));
				localStorage.setItem('dataFavorites', JSON.stringify(dataFavorites));
				render(dataFavorites);
				update(ref(database, 'users/' + userDataFavorites.userUid), {
					favorites_music: userDataFavorites.favorites_music,
				});
			};
			optionDownLoads[index].onclick = () => {
				if (userDataFavorites) {
					// console.log(
					// 	`http://167.172.93.181/api/v1/get/redirect?url=https://api.mp3.zing.vn/api/streaming/audio/${dataFavorites[index].encodeId}/320`
					// );
					// console.log(`${dataFavorites[index].alias}.mp3`);
					download(
						`http://localhost:3000/redirect?url=https://api.mp3.zing.vn/api/streaming/audio/${dataFavorites[index].encodeId}/320`,
						`${dataFavorites[index].alias}.mp3`
					);
				}
			};
		} else {
			item.classList.remove('active');
		}
	});
};
