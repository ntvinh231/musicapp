const btnLogin = $('.btn-login');
const btnRegister = $('.header-register');
const loginForm = $('.auth-form--login');
const registerForm = $('.auth-form--register');
const modal = $('.modal');
const modalOverlay = $('.modal__overlay');
const personalName = $('.personal-name');
const image = $('#image');
const userLogin = $('.header__right');

// var countID = 1;

const isLogin = false;

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
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export function SignUp(name, email, password, repassword) {
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
	const authenEmail = email;
	const authenPassword = password;
	createUserWithEmailAndPassword(auth, authenEmail, authenPassword)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			set(ref(database, 'users/' + user.uid), {
				// id: countID,
				username: name,
				email: email,
				first_name: '',
				last_name: '',
				gender: '',
				// date_of_birth: '',
				password: password,
				repassword: repassword,
				urlImage: `./assets/img/user/${imageUrl}`,
				registrationDate: logRegistration,
				last_login: '',
			}).then(() => {
				// Data saved successfully!
				alert('Đăng ký thành công');
				// countID++;
				modal.classList.remove('active');
				modalOverlay.classList.remove('active');
				$('.modal__body').style.display = 'none';
			});
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorMessage);
		});
}

const submitLogin = $('.submit-login');
submitLogin.onclick = (e) => {
	e.preventDefault();
	const email = $('.emailLogin').value;
	const password = $('.passwordLogin').value;

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			// SignIn
			SignIn(user);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			// ..
			console.log(errorMessage);
			if (errorCode === 'auth/too-many-requests') {
				$('#loginAlert').textContent = 'Bạn đã nhập sai quá nhiều, hãy thử lại sau 5s';
			} else $('.loginErrorUser').style.display = 'block';
		});
};

function SignIn(user) {
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
	update(ref(database, 'users/' + user.uid), {
		last_login: logDate,
	})
		.then(() => {
			// Data saved successfully!
			alert('Đăng nhập thành công');
			const databaseRef = ref(database);
			get(child(databaseRef, `users/` + user.uid))
				.then((snapshot) => {
					if (snapshot.exists()) {
						let data = snapshot.val();
						handleLoadSignIn(data);
					} else {
						console.log('No data available');
					}
				})
				.catch((error) => {
					console.error(error);
				});

			modal.classList.remove('active');
			modalOverlay.classList.remove('active');
			$('.modal__body').style.display = 'none';
		})
		.catch((error) => {
			// The write failed...
			console.log(error);
		});
}

function handleLoadSignIn(data) {
	const login = document.createElement('div');
	login.classList.add('header__right-logout__container');
	login.innerHTML = `
	<div class="header__right--logout">
			<div class="header__right-icon">
				<i class="fa-sharp fa-solid fa-gear"></i>
				<span class="tooltip">Cài Đặt</span>
			</div>
			<div class="header__right-img"></div>
		</div>
	`;
	userLogin.appendChild(login);
	personalName.textContent = data.username;
	image.src = data.urlImage;
	userLogin.classList.add('login');
	$('.header__right-img').style.backgroundImage = `url('${data.urlImage}')`;
}
