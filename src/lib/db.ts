import Dexie from 'dexie';
import state from './state';

const db = new Dexie('data-analyzer');
db.version(1).stores({
	files: `++id, name, type, last_opened, first_opened`,
});

export default db;

export async function saveFile(name: string, type: string, content: any) {
	await db.table('files').put({
		name,
		type,
		content,
		last_opened: Date.now(),
		first_opened: Date.now(),
	});
}

export async function updateFilesList() {
	const files = await (await db.table('files').toArray()).map((f) => ({
		name: f.name,
		type: f.type,
		last_opened: f.last_opened,
		first_opened: f.first_opened,
	}));
	state.files = files;
}
