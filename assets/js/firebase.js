const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const btnLogin = $('.btn-login');
const btnRegister = $('.header-register');
const loginForm = $('.auth-form--login');
const registerForm = $('.auth-form--register');
const modal = $('.modal');
const modalOverlay = $('.modal__overlay');
const personalName = $('.personal-name');
const image = $('#image');
const userLogin = $('.header__right');
const SignOut = $('.Signout');

import { handleRender } from './favoriteuser.js';

var currentUser = null;

btnLogin.onclick = (e) => {
	e.preventDefault();
	modal.classList.add('active');
	modalOverlay.classList.add('active');
	$('.modal__body').style.display = 'block';
	loginForm.style.display = 'block';
	registerForm.style.display = 'none';
};

btnRegister.onclick = (e) => {
	e.preventDefault();
	modal.classList.add('active');
	modalOverlay.classList.add('active');
	$('.modal__body').style.display = 'block';
	loginForm.style.display = 'none';
	registerForm.style.display = 'block';
};

modalOverlay.onclick = () => {
	modal.classList.remove('active');
	modalOverlay.classList.remove('active');
	$('.modal__body').style.display = 'none';
};

// ------------------ Firebase --------------------------

// Import the functions you need from the SDKs you need
import { set, ref, child, get, update } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
	updatePassword,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js';
import { firebase, auth, database } from './config.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import dotenv from 'dotenv';
// dotenv.config();
// console.log(process.env.API_KEY);

import { render } from './favoriteuser.js';

export function SignUp(username, emailRegister, passwordRegister) {
	let imageUrl = 'avatar.jpg';
	var d = new Date();
	var logRegistration =
		('0' + d.getDate()).slice(-2) +
		'-' +
		('0' + (d.getMonth() + 1)).slice(-2) +
		'-' +
		d.getFullYear() +
		' ' +
		('0' + d.getHours()).slice(-2) +
		':' +
		('0' + d.getMinutes()).slice(-2);
	createUserWithEmailAndPassword(auth, emailRegister, passwordRegister)
		.then((userCredential) => {
			const user = userCredential.user;
			set(ref(database, 'users/' + user.uid), {
				username: username,
				email: emailRegister,
				first_name: '',
				last_name: '',
				phone_number: '',
				gender: '',
				date_of_birth: '',
				password: encPass(passwordRegister),
				urlImage: `./assets/img/user/${imageUrl}`,
				registrationDate: logRegistration,
				last_login: '',
				account_type: 0,
				favorites_music: null,
			})
				.then(() => {
					alert('Đăng ký thành công');
					window.location = 'index.html';
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorMessage);
			alert('Email đã tồn tại vui lòng sử dụng email khác');
		});
}

function encPass(pass) {
	var passE = CryptoJS.MD5(pass);
	return passE.toString();
}

const submitLogin = $('.submit-login');
submitLogin.onclick = (e) => {
	e.preventDefault();
	const email = $('.emailLogin').value;
	const password = $('.passwordLogin').value;

	const databaseRef = ref(database);
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			get(child(databaseRef, 'users/' + user.uid)).then((snapshot) => {
				alert('Đăng nhập thành công');
				user.displayName = snapshot.val().username;
				// When was logged
				console.log(snapshot.val());
				SignIn(snapshot.val(), user);
			});
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorMessage);
			if (errorCode === 'auth/too-many-requests') {
				$('#loginAlert').textContent = 'Bạn đã nhập sai quá nhiều, hãy thử lại sau 5s';
			} else $('.loginErrorUser').style.display = 'block';
		});
};

function SignIn(user, userUid) {
	var d = new Date();
	var logDate =
		('0' + d.getDate()).slice(-2) +
		'-' +
		('0' + (d.getMonth() + 1)).slice(-2) +
		'-' +
		d.getFullYear() +
		' ' +
		('0' + d.getHours()).slice(-2) +
		':' +
		('0' + d.getMinutes()).slice(-2);
	update(ref(database, 'users/' + userUid.uid), {
		last_login: logDate,
	});
	const userData = {
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
		gender: user.gender,
		urlImage: user.urlImage,
		username: user.username,
	};
	const userDataFavorite = {
		userUid: userUid.uid,
		favorites_music: user.favorites_music != null ? user.favorites_music : [],
	};
	let keepLoggedIn = document.getElementById('customSwitch').checked;
	if (!keepLoggedIn) {
		// sessionStorage.setItem('userData', JSON.stringify(userData));
		setCookie('userData', JSON.stringify(userData), 6);
		handleLoggedIn();
	} else {
		localStorage.setItem('keepLoggedIn', keepLoggedIn);
		localStorage.setItem('userData', JSON.stringify(userData));
		handleLoggedIn();
	}
	window.location = 'index.html';
	localStorage.setItem('userDataFavorite', JSON.stringify(userDataFavorite));
	window.onload();
}

function setCookie(name, value, hours) {
	if (hours) {
		var date = new Date();
		date.setTime(date.getTime() + hours * 60 * 60 * 1000);
		var expires = '; expires=' + date.toGMTString();
	} else {
		var expires = '';
	}
	document.cookie = name + '=' + value + expires + '; path=/';
}

export function getCookie() {
	return document.cookie.split(';').reduce((res, c) => {
		const [key, val] = c.trim().split('=').map(decodeURIComponent);
		const allNumbers = (str) => /^\d+$/.test(str);
		try {
			return Object.assign(res, { [key]: allNumbers(val) ? val : JSON.parse(val) });
		} catch (e) {
			return Object.assign(res, { [key]: val });
		}
	}, {});
}

function deleteCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

SignOut.addEventListener('click', () => {
	deleteCookie('userData');
	localStorage.removeItem('userData');
	localStorage.removeItem('userDataFavorite');
	localStorage.removeItem('keepLoggedIn');
	localStorage.removeItem('dataFavorites');
	userLogin.classList.remove('login');
	window.location = 'index.html';
});

export function renderUser() {
	let keepLoggedIn = localStorage.getItem('keepLoggedIn');
	if (keepLoggedIn) {
		currentUser = JSON.parse(localStorage.getItem('userData'));
	} else {
		currentUser = getCookie().userData;
	}
}

const userDataFavorites = JSON.parse(localStorage.getItem('userDataFavorite'));
window.onload = function () {
	handleRender();
	renderUser();
	if (currentUser != null) {
		const dbRef = ref(database);
		get(child(dbRef, `users/${userDataFavorites.userUid}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					personalName.textContent = snapshot.val().username;
					image.src = snapshot.val().urlImage;
					userLogin.classList.add('login');
					$('.header__right-img').style.backgroundImage = `url('${snapshot.val().urlImage}')`;
				} else {
					console.log('No data available');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}
};

const dataFavorites = JSON.parse(localStorage.getItem('dataFavorites'));
function handleLoggedIn() {
	renderUser();
	render(dataFavorites);
	if (currentUser != null) {
		personalName.textContent = currentUser.username;
		image.src = currentUser.urlImage;
		userLogin.classList.add('login');
		$('.header__right-img').style.backgroundImage = `url('${currentUser.urlImage}')`;
	}
	modal.classList.remove('active');
	modalOverlay.classList.remove('active');
	$('.modal__body').style.display = 'none';
}
