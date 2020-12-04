import { TableDataType } from '../components/types';

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
