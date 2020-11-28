import { reactive } from 'vue';
import { DBFileObject } from './db';

interface State {
	files: DBFileObject[];
}

const state: State = reactive({
	files: [],
});

export default state;

export function findFile(file_id: string) {
	return state.files.find((f) => f.file_id === file_id);
}
