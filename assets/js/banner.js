document.getElementById('slide-button__next').onclick = () => {
	let lists = document.querySelectorAll('.song-side__item');
	document.querySelector('.song-side__slide').appendChild(lists[1]);
};

document.getElementById('slide-button__prev').onclick = () => {
	let lists = document.querySelectorAll('.song-side__item');
	document.querySelector('.song-side__slide').prepend(lists[lists.length - 2]);
};

setInterval(() => {
	document.getElementById('slide-button__next').click();
}, 7000);
