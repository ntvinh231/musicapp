import { firebase, auth, database } from './config.js';
import { getCookie } from './firebase.js';
import { set, ref, child, get, update } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const btnLogin = $('.btn-login');
const btnRegister = $('.header-register');
const loginForm = $('.auth-form--login');
const registerForm = $('.auth-form--register');
const modal = $('.modal');
const modalOverlay = $('.modal__overlay');

export const favoriteUser = (userDataFavorite, idSongRank) => {
	const localData = JSON.parse(localStorage.getItem('userData'));
	const cookieData = getCookie().userData;
	// renderFavoriteUser(userDataFavorite);
	// check user was logged
	if (localData || cookieData) {
		// check data exists
		if (Array.isArray(userDataFavorite.favorites_music)) {
			if (userDataFavorite.favorites_music.includes(idSongRank)) {
				console.log('Đã tồn tại trong danh sach');
			} else {
				userDataFavorite.favorites_music.push(idSongRank);
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

const renderFavoriteUser = (dataFavorite) => {
	const getMusic = async (id) => {
		try {
			let reponse = await fetch(`https://apizingmp3.vercel.app/api/infosong?id=${id}`);
			if (reponse && reponse.status != 200) {
				throw new Error('Wrongs status code: ' + reponse.status);
			}
			let data = await reponse.json();
			return data;
		} catch (error) {
			console.log('Check error: ' + error);
		}
	};

	dataFavorite.favorites_music.forEach((data) => {
		getMusic(data)
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log('Check err: ' + err);
			});
	});
};
