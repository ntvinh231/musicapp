export const timeFormat = (seconds) => {
	const date = new Date(null);
	date.setSeconds(seconds);
	return date.toISOString().slice(14, 19);
};

export const dateFormat = (dateFormat) => {
	dayjs.extend(dayjs_plugin_updateLocale);
	dayjs.locale('vi');
	var thresholds = [
		{ l: 's', r: 1 },
		{ l: 'ss', r: 59, d: 'second' },
		{ l: 'm', r: 1 },
		{ l: 'mm', r: 59, d: 'minute' },
		{ l: 'h', r: 1 },
		{ l: 'hh', r: 23, d: 'hour' },
		{ l: 'd', r: 1 },
		{ l: 'dd', r: 6, d: 'day' },
		{ l: 'w', r: 1 },
		{ l: 'ww', r: 4, d: 'week' },
		{ l: 'M', r: 1 },
		{ l: 'MM', r: 11, d: 'month' },
		{ l: 'y', r: 1 },
		{ l: 'yy', d: 'year' },
	];
	const rounding = Math.floor; // default is Math.round
	dayjs.extend(dayjs_plugin_relativeTime, {
		thresholds,
		rounding,
	});

	dayjs.updateLocale('vi', {
		relativeTime: {
			future: 'in %s',
			past: '%s',
			s: 'a phút trước',
			m: 'a phút',
			mm: '%d phút',
			h: 'an giờ trước',
			hh: '%d giờ trước',
			d: 'Hôm qua',
			dd: '%d ngày trước',
			w: '%d tuần trước',
			ww: '%d tuần trước',
			M: 'a tháng trước',
			MM: '%d tháng trước',
			y: 'a năm trước',
			yy: '%d năm trước',
		},
	});
	return dayjs.unix(dateFormat).fromNow();
};
