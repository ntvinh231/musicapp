let relatedId = [];
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const artistsList = $('.overview__section-list-artists');
export const artistInfo = async (id) => {
	try {
		let data = await axios.get(`https://mp3.zing.vn/xhr/media/get-info?type=audio&id=${id}`);
		relatedId = data;
		renderartistInfo(relatedId);
	} catch {}
};
const dataUrls = [];
const newData = [];

const renderartistInfo = async (data) => {
	await data.data.data.artists.forEach((artist, index) => {
		dataUrls.splice(index, 0, artist);
	});
	render(dataUrls);
};

const render = (dataUrls) => {
	// Xử Lý Lặp Ca Sĩ
	const newArray = dataUrls.map((m) => [m.name, m]);
	const newMap = new Map(newArray);
	const iterator = newMap.values();
	const unique = [...iterator];
	var htmls = unique.map((artist, index) => {
		return `
			<div class="section-list__artist-item-artists">
				<div class="item-artists__container">
					<img class="item-artists-img"
						src=${artist.thumbnail}
						alt="">
						
					<span class="item-artists-name">${artist.name}</span>
				</div>
			</div>
			`;
	});
	artistsList.innerHTML = htmls.join('');
};
