let setTimeInterval = 4000;
let repeat = setInterval(() => {
	document.getElementById('slide-button__next').click();
}, setTimeInterval);

document.getElementById('slide-button__next').onclick = () => {
	let lists = document.querySelectorAll('.song-side__item');
	document.querySelector('.song-side__slide').appendChild(lists[1]);
	clearInterval(repeat);
	repeat = setInterval(() => {
		document.getElementById('slide-button__next').click();
	}, setTimeInterval);
};

document.getElementById('slide-button__prev').onclick = () => {
	let lists = document.querySelectorAll('.song-side__item');
	document.querySelector('.song-side__slide').prepend(lists[lists.length - 2]);
	clearInterval(repeat);
	repeat = setInterval(() => {
		document.getElementById('slide-button__next').click();
	}, setTimeInterval);
};
