export default function handleSlideShow() {
	let setTimeInterval = 4000;
	let repeat = setInterval(() => {
		document.getElementById('slide-button__next').click();
	}, setTimeInterval);

	const slide = document.querySelector('.song-side__slide');
	document.getElementById('slide-button__next').onclick = () => {
		let lists = document.querySelectorAll('.song-side__item');
		slide.appendChild(lists[1]);
		clearInterval(repeat);
		repeat = setInterval(() => {
			document.getElementById('slide-button__next').click();
		}, setTimeInterval);
	};

	document.getElementById('slide-button__prev').onclick = () => {
		let lists = document.querySelectorAll('.song-side__item');
		slide.prepend(lists[lists.length - 2]);
		clearInterval(repeat);
		repeat = setInterval(() => {
			document.getElementById('slide-button__next').click();
		}, setTimeInterval);
	};
}
