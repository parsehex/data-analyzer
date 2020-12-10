import numeral from 'numeral';
import { TableDataType } from '@/types/components';

export function generateID() {
	return '' + Math.random().toString(36).substr(2, 9);
}

export function clone<T>(d: T): T {
	return JSON.parse(JSON.stringify(d));
}

export function idFromString(str: TableDataType) {
	if (typeof str !== 'string') str = str.toString();
	return str.toLowerCase().replace(/['"]/g, '').replace(/[ ]/g, '-');
}

export function newDateFromExcel(serial: number) {
	// it would be wise to never touch this function again
	const utc_days = Math.floor(serial - 25568);
	const utc_value = utc_days * 86400;
	const date_info = new Date(utc_value * 1000);

	const fractional_day = serial - Math.floor(serial) + 0.0000001;

	let total_seconds = Math.floor(86400 * fractional_day);

	const seconds = total_seconds % 60;

	total_seconds -= seconds;

	const hours = Math.floor(total_seconds / (60 * 60));
	const minutes = Math.floor(total_seconds / 60) % 60;

	return new Date(
		date_info.getFullYear(),
		date_info.getMonth(),
		date_info.getDate(),
		hours,
		minutes,
		seconds
	);
}

export function nowSeconds() {
	return Math.round(Date.now() / 1000);
}

/** Format number as a dollar string (with dolar sign) */
export function $(money: number) {
	return '$' + numeral(money).format('0,0.00');
}
