import Dexie from 'dexie';
import state, { findFile } from '@/lib/state';
import { clone, generateID, nowSeconds } from '@/lib/utils';
import { FileType, DBFileObject } from '@/types/db';
import applyVersions from './versions';

const db = new Dexie('data-analyzer');
applyVersions(db);

export default db;

export async function initDB() {
	await db.open();
}

interface AddFileOptions<FileDataType> {
	name: string;
	type: FileType;
	content: FileDataType;
	version: number;
	file_names: string[];
}
export async function addFile<FileDataType>({
	name,
	type,
	content,
	version,
	file_names,
}: AddFileOptions<FileDataType>) {
	const file: DBFileObject<FileDataType> = {
		file_id: generateID(),
		name,
		type,
		content,
		version,
		file_names,
		last_opened: nowSeconds(),
		first_opened: nowSeconds(),
	};
	await db.table('files').add(file);
	return file;
}

interface UpdateFileOptions<FileDataType = unknown> {
	file_id: string;
	name?: string;
	content?: FileDataType;
	last_opened?: number;
	version?: number;
	file_names: string[];
}
export async function updateFile<FileDataType = unknown>(
	options: UpdateFileOptions<FileDataType>
) {
	// warn if file not found
	const oldData = await getFile(options.file_id);
	if (!oldData) console.warn('Could not find requested file by ID to update.');

	const newData = clone(Object.assign({}, oldData, options));
	await db
		.table('files')
		.where('file_id')
		.equals(options.file_id)
		.modify(newData);
}

export async function getFile<FileDataType>(
	file_id: string
): Promise<DBFileObject<FileDataType>> {
	return await db.table('files').get({
		file_id,
	});
}

export async function removeFile(file_id: string) {
	await db.table('files').where('file_id').equals(file_id).delete();
	const i = state.files.indexOf(findFile(file_id));
	state.files.splice(i, 1);
}

export async function updateFilesList() {
	const files: DBFileObject<unknown>[] = [];
	await db.table('files').each((f) => {
		files.push(f);
	});
	files.sort((a, b) => b.last_opened - a.last_opened);
	state.files = files;
}
