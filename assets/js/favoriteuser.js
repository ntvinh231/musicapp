import { firebase, auth, database } from './config.js';
import { getCookie } from './firebase.js';
import { set, ref, child, get, update } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js';
import { artistInfo } from './artistsinfo.js';

let useData = [];

const userDataFavorites = JSON.parse(localStorage.getItem('userDataFavorite'));

export const idfavoriteUser = (userDataFavorite, idSongRank) => {
	const localData = JSON.parse(localStorage.getItem('userData'));
	const cookieData = getCookie().userData;

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
				}, 1000);
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

const toastSlide = () => {
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
const timeFormat = (seconds) => {
	const date = new Date(null);
	date.setSeconds(seconds);
	return date.toISOString().slice(14, 19);
};

export const render = (dataFavorites) => {
	if (dataFavorites) {
		const listSongsBlock = document.querySelector('.section-list__body');
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
				<span class="media__center-album subtitle-name">${data.album.title}</span>
			</div>
				<div class="item-media__right">
					<span class="media__right-duration subtitle-name">${timeFormat(data.duration)}</span>
					<i
					class="media__right-option icon-option fa-solid fa-ellipsis"></i>
					<div class="media__right-option-menu"></div>
			</div>
		</div>
	`;
		});
		listSongsBlock.innerHTML = htmls.join('');
	}
};
