import { reactive } from 'vue';
import { DBFileObject } from '@/types/db';

interface State {
	files: DBFileObject<unknown>[];
	isDev: boolean;
	isLoading: boolean;
	timingEnabled: boolean;
}

const state: State = reactive({
	files: [],
	isDev: window.location.href.includes('localhost'),
	isLoading: false,
	timingEnabled: false,
});

export default state;

export function findFile(file_id: string) {
	return state.files.find((f) => f.file_id === file_id);
}
