import { reactive } from 'vue';
import { DBFileObject } from '@/types/db';

interface State {
	files: DBFileObject[];
	isDev: boolean;
}

const state: State = reactive({
	files: [],
	isDev: window.location.href.includes('localhost'),
});

export default state;

export function findFile(file_id: string) {
	return state.files.find((f) => f.file_id === file_id);
}
