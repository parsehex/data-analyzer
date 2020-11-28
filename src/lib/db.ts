import Dexie from 'dexie';
import state, { findFile } from './state';
import { generateID } from './utils';

const db = new Dexie('data-analyzer');
db.version(1).stores({
	files: `++id, file_id, name, type, last_opened, first_opened`,
	files_data: '++id, file_id, version, type',
});

export default db;

export async function addFileData(
	file_id: string,
	file_data: any,
	version: number
) {
	await db.table('files_data').put({
		file_id,
		file_data,
		version,
	});
}
export interface DBFileDataObject {
	file_id: string;
	type: FileType;
	file_data: any;
}
export async function getFileData(file_id: string): Promise<DBFileDataObject> {
	const f = await db.table('files_data').get({
		file_id,
	});
	return f;
}

type FileType = 'therapy_notes_spreadsheet';

export interface DBFileObject {
	file_id: string;
	name: string;
	type: FileType;
	content: ArrayBuffer;
	last_opened: number;
	first_opened: number;
}
export async function saveFile(name: string, type: FileType, content: any) {
	const file: DBFileObject = {
		file_id: generateID(),
		name,
		type,
		content,
		last_opened: Date.now() / 1000,
		first_opened: Date.now() / 1000,
	};
	await db.table('files').add(file);
	return file;
}
export async function getFileContent(file_id: string): Promise<ArrayBuffer> {
	return (await db.table('files').where('file_id').equals(file_id).first())
		.content;
}
export async function removeFile(file_id: string) {
	await db.table('files').where('file_id').equals(file_id).delete();
	await db.table('files_data').where('file_id').equals(file_id).delete();
	const i = state.files.indexOf(findFile(file_id));
	state.files.splice(i, 1);
}

export async function updateFilesList() {
	const files: DBFileObject[] = [];
	await db.table('files').each((f) => {
		delete f.content;
		files.push(f);
	});
	state.files = files;
}
