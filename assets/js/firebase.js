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
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js';
import {
	getDatabase,
	set,
	ref,
	child,
	get,
	update,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
	updatePassword,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import * as dotenv from './';
// dotenv.config();
// console.log(process.env.DB_USER);
// console.log(process.env.ENV);
// console.log(process.env.DB_PORT);

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDoV7Zg2dutjW9Ib0e3LkyEzt6qpzWw8l8',
	authDomain: 'music-app-2420a.firebaseapp.com',
	databaseURL: 'https://music-app-2420a-default-rtdb.firebaseio.com',
	projectId: 'music-app-2420a',
	storageBucket: 'music-app-2420a.appspot.com',
	messagingSenderId: '912383656489',
	appId: '1:912383656489:web:4904d35d7b7ae3e93b9238',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

export function SignUp(username, emailRegister, passwordRegister) {
	let imageUrl = 'chicago.jpg';
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
				gender: '',
				// date_of_birth: '',
				password: encPass(passwordRegister),
				urlImage: `./assets/img/user/${imageUrl}`,
				registrationDate: logRegistration,
				last_login: '',
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
				// console.log(userCredential);
				// console.log(snapshot.val());
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

function SignIn(user, user2) {
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
	update(ref(database, 'users/' + user2.uid), {
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
	let keepLoggedIn = document.getElementById('customSwitch').checked;
	if (!keepLoggedIn) {
		// sessionStorage.setItem('userData', JSON.stringify(userData));
		setCookie('userData', JSON.stringify(userData), 1);
	} else {
		localStorage.setItem('keepLoggedIn', keepLoggedIn);
		localStorage.setItem('userData', JSON.stringify(userData));
	}
	renderLoggin();
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

function setCookie2(params) {
	var name = params.name,
		value = params.value,
		expireDays = params.days,
		expireHours = params.hours,
		expireMinutes = params.minutes,
		expireSeconds = params.seconds;

	var expireDate = new Date();
	if (expireDays) {
		expireDate.setDate(expireDate.getDate() + expireDays);
	}
	if (expireHours) {
		expireDate.setHours(expireDate.getHours() + expireHours);
	}
	if (expireMinutes) {
		expireDate.setMinutes(expireDate.getMinutes() + expireMinutes);
	}
	if (expireSeconds) {
		expireDate.setSeconds(expireDate.getSeconds() + expireSeconds);
	}

	document.cookie =
		name +
		'=' +
		escape(value) +
		';domain=' +
		window.location.hostname +
		';path=/' +
		';expires=' +
		expireDate.toUTCString();
}

function deleteCookie(name) {
	setCookie2({ name: name, value: '', seconds: 1 });
}

SignOut.addEventListener('click', () => {
	deleteCookie('userData');
	localStorage.removeItem('userData');
	localStorage.removeItem('keepLoggedIn');
	window.location = 'index.html';
});

function renderLoggin() {
	let keepLoggedIn = localStorage.getItem('keepLoggedIn');
	if (keepLoggedIn) {
		currentUser = JSON.parse(localStorage.getItem('userData'));
	} else {
		// currentUser = JSON.parse(sessionStorage.getItem('userData'));
		currentUser = getCookie().userData;
	}
	modal.classList.remove('active');
	modalOverlay.classList.remove('active');
	$('.modal__body').style.display = 'none';

	if (currentUser != null) {
		personalName.textContent = currentUser.username;
		image.src = currentUser.urlImage;
		userLogin.classList.add('login');
		$('.header__right-img').style.backgroundImage = `url('${currentUser.urlImage}')`;
	}
}
