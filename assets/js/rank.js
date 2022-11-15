const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const genresSelect = $$('.navbar-genre');
const genresPanes = $$('.navbar-genre__container');

genresSelect.forEach((genre, index) => {
	const genrePane = genresPanes[index];
	genre.onclick = () => {
		$('.navbar-genre.active').classList.remove('active');
		genre.classList.add('active');
		$('.navbar-genre__container.active').classList.remove('active');
		genrePane.classList.add('active');
	};
});

export function renderSongsRank(rankData, genreList) {
	if (rankData.msg === 'Success' && rankData.err === 0) {
		const rankDataSongs = rankData.data.song;
		var htmls = rankDataSongs.map((song, index) => {
			return `
				<div class="genre-item" data-index=${index}>
					<div class="genre-item__action action__like">
						<i class="genre-item__action-empty action__like-empty fa-regular fa-heart"></i>
						<i class="genre-item__action-empty action__like-fill fa-solid fa-heart"></i>
					</div>
					<span class="genre-item__number">${index < 9 ? '0' + (index + 1) : index + 1}</span>
					<div class="genre-item__image">
						<img src="${song.thumbnail}" alt="">
					</div>
					<div class="genre-item__info">
						<span class="genre-item__info-name title-name">${song.name}</span>
						<span class="genre-item__info-artit-name subtitle-name">${song.artists_names}</span>
					</div>
					<div class="genre-item__play">
						<i class="genre-icon fa-solid fa-circle-play"></i>
					</div>
				</div>
			`;
		});
		genreList.innerHTML = htmls.join('');
	}
}
