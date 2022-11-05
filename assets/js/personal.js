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
