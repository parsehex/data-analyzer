export const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sept',
	'Oct',
	'Nov',
	'Dec',
];

export function daysInMonth(month: number, year: number) {
	return new Date(year, month, 0).getDate();
}
