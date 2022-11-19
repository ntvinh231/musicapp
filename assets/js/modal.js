const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import { getCookie } from './firebase.js';

const btnLogin = $('.btn-login');
const btnRegister = $('.header-register');
const loginForm = $('.auth-form--login');
const registerForm = $('.auth-form--register');
const modal = $('.modal');
const modalOverlay = $('.modal__overlay');

const optionsItem = $$('.option-item');
const tabsPersonal = $$('.personals');
optionsItem.forEach((option, index) => {
	const tabPersonal = tabsPersonal[index];
	option.onclick = function () {
		$('.option-item.active').classList.remove('active');
		$('.personals.active').classList.remove('active');
		this.classList.add('active');
		tabPersonal.classList.add('active');
	};
});

const navbars = $$('.header__navbar-item');
const sidesContainer = $$('.song-side__container');
const navbarActive = $('.header__navbar-item.active');
const line = $('.line');

line.style.left = navbarActive.children[0].offsetLeft - 10 + 'px';
line.style.width = navbarActive.children[0].offsetWidth + 20 + 'px';
navbars.forEach((navbar, index) => {
	const sideContainer = sidesContainer[index];
	navbar.onclick = function () {
		const localData = JSON.parse(localStorage.getItem('userData'));
		const cookieData = getCookie().userData;
		if (cookieData || localData) {
			$('.header__navbar-item.active').classList.remove('active');
			$('.song-side__container.active').classList.remove('active');

			line.style.left = this.children[0].offsetLeft - 10 + 'px';
			line.style.width = this.children[0].offsetWidth + 20 + 'px';

			this.classList.add('active');
			sideContainer.classList.add('active');
		} else {
			if (index === 1) {
				modal.classList.add('active');
				modalOverlay.classList.add('active');
				$('.modal__body').style.display = 'block';
				loginForm.style.display = 'block';
				registerForm.style.display = 'none';
			} else {
				$('.header__navbar-item.active').classList.remove('active');
				$('.song-side__container.active').classList.remove('active');

				line.style.left = this.children[0].offsetLeft - 10 + 'px';
				line.style.width = this.children[0].offsetWidth + 20 + 'px';

				this.classList.add('active');
				sideContainer.classList.add('active');
			}
		}
	};
});
