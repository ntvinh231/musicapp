export const timeFormat = (seconds) => {
	const date = new Date(null);
	date.setSeconds(seconds);
	return date.toISOString().slice(14, 19);
};

export const dateFormat = (dateFormat) => {
	let date = new Date(dateFormat * 1000);
	return date.toLocaleDateString();
};
