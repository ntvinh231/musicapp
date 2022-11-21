const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import handleSlideShow from './banner.js';
import { dateFormat } from './format/timeFormat.js';

const releaseGenres = $$('.new-release__genre-btn');
const releaseMultilines = $$('.new-release__multiline');
const releaseColumn = $$('.new-release__multiline-column');

const getData = async () => {
	try {
		let data = await axios.get(`https://apizingmp3.herokuapp.com/api/home?page=1`);
		console.log(data.data.data.items);
		let dataBanner = data.data.data.items[0];
		let dataRelease = data.data.data.items[3];
		renderBanner(dataBanner.items);
		renderReleaseAll(dataRelease.items.all);
	} catch (e) {
		console.log(e);
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
		console.log(data);
		if (index < 5) {
			return `
                <div class="new-release__multiline-list">
                    <div class="new-release__multiline-item">
                        <div class="multiline-item__media">
                            <div class="multiline-item__media-left">
                                <div class="media-left__thumb">
                                    <img src="${data.thumbnail}"
                                        alt="">
                                </div>
                                <div class="media-left__info">
                                    <span class="media-left__info-name title-name">${data.title}</span>
                                    <a class="media-left__artist-name subtitle-name">${data.artistsNames}</a>
                                    <span class="media-left__time-release subtitle-name">${dateFormat(
																			data.releaseDate
																		)}</span>
                                </div>
                            </div>
                            <div title="Khác" class="multiline-item__media-right">
                                <i class="icon-release left-action__ellip fa-solid fa-ellipsis"></i>
                            </div>
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
		        <div class="new-release__multiline-list">
		            <div class="new-release__multiline-item">
		                <div class="multiline-item__media">
		                    <div class="multiline-item__media-left">
		                        <div class="media-left__thumb">
		                            <img src="${data.thumbnail}"
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
		        </div>
		    `;
		}
	});
	releaseColumn[1].innerHTML = htmls1.join('');

	// Col-2
	let htmls2 = dataReleaseAll.map((data, index) => {
		if (index >= 10 && index < 16) {
			return `
		        <div class="new-release__multiline-list">
		            <div class="new-release__multiline-item">
		                <div class="multiline-item__media">
		                    <div class="multiline-item__media-left">
		                        <div class="media-left__thumb">
		                            <img src="${data.thumbnail}"
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
		        </div>
		    `;
		}
	});
	releaseColumn[2].innerHTML = htmls2.join('');
};

// const getRecent = async () => {
// 	try {
// 		let data = await axios.get(`http://apizingmp3.herokuapp.com/api/top100`);
// 	} catch (e) {
// 		console.log(e);
// 	}
// };
// getRecent();
