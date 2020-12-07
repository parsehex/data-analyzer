import { clone } from './utils';

interface SavedData<T> {
	data: T;
	version: number;
}

export function saveSettings<T>(id: string, data: T, version: number) {
	const key = 'da-' + id;

	const d: SavedData<T> = {
		data: clone(data),
		version,
	};
	localStorage.setItem(key, JSON.stringify(d));
}

export function loadSettings<T>(
	id: string,
	defaultData: T,
	currentVersion: number
): T {
	const key = 'da-' + id;

	const lsStr = localStorage.getItem(key);

	if (!lsStr) return clone(defaultData);

	try {
		const data = JSON.parse(lsStr) as SavedData<T>;

		if (data.version !== currentVersion) {
			// version mismatch
			localStorage.removeItem(key);
			return clone(defaultData);
		}

		return clone(data.data);
	} catch (e) {
		// probably not formatted correctly
		localStorage.removeItem(key);
		return clone(defaultData);
	}
}
