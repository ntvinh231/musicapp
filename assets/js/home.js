const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songTitle = $('.left-content__song-name');
const cdThumb = $('.control__left-cdthumb');
const artitName = $('.left-content__artit-name');

import handleSlideShow from './banner.js';
import { dateFormat } from './format/timeFormat.js';

const releaseGenres = $$('.new-release__genre-btn');
const releaseMultilines = $$('.new-release__multiline');
const releaseColumn = $$('.new-release__multiline-column');
const headerSearchInput = $('.header__search-input');
const headerSearchList = $('.header__search-list');

function debounce(cb, delay = 1000) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
}

headerSearchInput.onkeyup = (e) => {
	getSearch(e.target.value);
};

const getSearch = debounce(async (keyword) => {
	try {
		let data = await axios.get(`https://apizingmp3.vercel.app/api/search?keyword=${keyword}`);
		let dataSearchSongs = data.data.data.songs;
		renderSearch(dataSearchSongs);
		// Handle click search
		$$('.header__search-item').forEach((item, index) => {
			item.onmousedown = (e) => {
				if (e.target.closest('.header__search-item')) {
					songTitle.textContent = dataSearchSongs[index].title;
					cdThumb.style.backgroundImage = `url(${dataSearchSongs[index].thumbnail})`;
					artitName.textContent = dataSearchSongs[index].artistsNames;
					audio.src = `http://api.mp3.zing.vn/api/streaming/audio/${dataSearchSongs[index].encodeId}/320`;
					audio.play();
				}
			};
		});
	} catch (e) {
		console.log(e);
	}
}, 250);

const renderSearch = (dataSearch) => {
	if (dataSearch) {
		let htmls = dataSearch.map((data, index) => {
			if (data) {
				return `
				<li class="header__search-item">
					<div class="header__search-item-image">
						<img src="${data.thumbnail}"
							alt="">
					</div>
					<div class="header__search-item-info">
						<a href="#" class="header__search-artist-name">${data.title}</a>
						<span class="header__search-artists">${data.artistsNames}</span>
					</div>
				</li>
			`;
			}
		});
		headerSearchList.innerHTML = htmls.join('');
	} else {
		$$('.header__search-item').forEach((item) => {
			item.remove();
		});
	}
};

releaseGenres.forEach((genre, index) => {
	const releaseMultiline = releaseMultilines[index];
	genre.onclick = () => {
		$('.new-release__genre-btn.active').classList.remove('active');
		$('.new-release__multiline.active').classList.remove('active');

		genre.classList.add('active');
		releaseMultiline.classList.add('active');
	};
});

const getData = async () => {
	try {
		let data = await axios.get(`https://apizingmp3.vercel.app/api/home?page=1`);
		console.log(data.data.data.items);
		let dataBanner = data.data.data.items[0];
		let dataRelease = data.data.data.items[3];
		renderBanner(dataBanner.items);
		renderReleaseAll(dataRelease.items.all);
		renderReleaseVPOP(dataRelease.items.vPop);
		renderReleaseOthers(dataRelease.items.others);
	} catch (e) {
		if (e.code === 'ERR_NETWORK') {
			alert('Load API lỗi');
		}
	}
};
getData();

const renderBanner = (dataBanner) => {
	var htmls = dataBanner.map((data) => {
		return `
        <a href="#" class="song-side__item l-4">
			<img class="song-side__item-img" src="${data.banner}" alt="">
        </a>
        `;
	});
	$('.song-side__slide').innerHTML = htmls.join('');
	handleSlideShow();
};

releaseGenres.forEach((genre, index) => {
	const releaseMultiline = releaseMultilines[index];
	genre.onclick = () => {
		$('.new-release__genre-btn.active').classList.remove('active');
		$('.new-release__multiline.active').classList.remove('active');

		genre.classList.add('active');
		releaseMultiline.classList.add('active');
	};
});

const renderReleaseAll = (dataReleaseAll) => {
	// Col=0
	let htmls0 = dataReleaseAll.map((data, index) => {
		if (index < 5) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[0].innerHTML = htmls0.join('');

	// Col-1
	let htmls1 = dataReleaseAll.map((data, index) => {
		if (index >= 5 && index < 10) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[1].innerHTML = htmls1.join('');

	// Col-2
	let htmls2 = dataReleaseAll.map((data, index) => {
		if (index >= 10 && index < 16) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[2].innerHTML = htmls2.join('');
};

const renderReleaseVPOP = (dataReleaseVPOP) => {
	// Col=0
	let htmls0 = dataReleaseVPOP.map((data, index) => {
		if (index < 5) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[3].innerHTML = htmls0.join('');

	// Col-1
	let htmls1 = dataReleaseVPOP.map((data, index) => {
		if (index >= 5 && index < 10) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[4].innerHTML = htmls1.join('');

	// Col-2
	let htmls2 = dataReleaseVPOP.map((data, index) => {
		if (index >= 10 && index < 16) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[5].innerHTML = htmls2.join('');
};

const renderReleaseOthers = (dataReleaseOthers) => {
	// Col=0
	let htmls0 = dataReleaseOthers.map((data, index) => {
		if (index < 5) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[6].innerHTML = htmls0.join('');

	// Col-1
	let htmls1 = dataReleaseOthers.map((data, index) => {
		if (index >= 5 && index < 10) {
			return `
				<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
					<div class="multiline-item__media">
						<div class="multiline-item__media-left">
							<div class="media-left__thumb">
								<img class="media-left__thumb-img" src="${data.thumbnail}"
									alt="">
							</div>
							<div class="media-left__info">
								<span class="media-left__info-name title-name">${data.title}</span>
								<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
								<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
							</div>
						</div>
						<div title="Khác" class="multiline-item__media-right">
							<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
						</div>
					</div>
				</div>
            `;
		}
	});
	releaseColumn[7].innerHTML = htmls1.join('');

	// Col-2
	let htmls2 = dataReleaseOthers.map((data, index) => {
		if (index >= 10 && index < 16) {
			return `
			<div class="new-release__multiline-item ${data.streamingStatus === 2 ? 'isvip' : ''}" data-index=${index}>
				<div class="multiline-item__media">
					<div class="multiline-item__media-left">
						<div class="media-left__thumb">
							<img class="media-left__thumb-img" src="${data.thumbnail}"
								alt="">
						</div>
						<div class="media-left__info">
							<span class="media-left__info-name title-name">${data.title}</span>
							<a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
							<span class="media-left__time-release subtitle-name">${dateFormat(data.releaseDate)}</span>
						</div>
					</div>
					<div title="Khác" class="multiline-item__media-right">
						<i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
					</div>
				</div>
			</div>
		`;
		}
	});
	releaseColumn[8].innerHTML = htmls2.join('');
};
