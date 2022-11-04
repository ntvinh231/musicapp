const btnLogin = $('.btn-login');
const registerLogin = $('.header-register');
const loginForm = $('.auth-form--login');
const registerForm = $('.auth-form--register');
const btnRegister = $('.btn-register');
const modal = $('.modal');
const modalOverlay = $('.modal__overlay');

btnLogin.onclick = (e) => {
	e.preventDefault();
	modal.classList.add('active');
	modalOverlay.classList.add('active');
	$('.modal__body').style.display = 'block';
	loginForm.style.display = 'block';
	registerForm.style.display = 'none';
};

registerLogin.onclick = (e) => {
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
