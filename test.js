function download(url, filename) {
	axios
		.get(url)
		.then((response) =>
			fetch(response.data.url)
				.then((response) => response.blob())
				.then((blob) => {
					const link = document.createElement('a');
					link.type = 'audio/mpeg';
					link.href = URL.createObjectURL(blob);
					link.download = filename;
					link.click();
				})
		)

		.catch(function (err) {
			console.info(err + ' url: ' + url);
		});
}
download(
	`http://167.172.93.181/api/v1/get/redirect?url=https://api.mp3.zing.vn/api/streaming/audio/Z6WZD78I/320`,
	'test.mp3'
);
