const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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

const headerNavbars = $$('.header__navbar-item');
const sidesContainer = $$('.song-side__container');
const navbarActive = $('.header__navbar-item.active');
const line = $('.line');

line.style.left = navbarActive.offsetLeft + 'px';
line.style.width = navbarActive.offsetWidth + 'px';

headerNavbars.forEach((navbar, index) => {
	const sideContainer = sidesContainer[index];
	navbar.onclick = function () {
		$('.header__navbar-item.active').classList.remove('active');
		$('.song-side__container.active').classList.remove('active');

		line.style.left = this.offsetLeft + 'px';
		line.style.width = this.offsetWidth + 'px';

		this.classList.add('active');
		sideContainer.classList.add('active');
	};
});
