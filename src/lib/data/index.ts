import { DataTypes } from '../../file-modules';
import { findFile } from '../state';
import * as xlsx from 'xlsx';
import { addFileData, DBFileObject, getFileContent } from '../db';
import { TherapyNotesColumn } from '../../data-types';

export async function processFile(file_id: string | DBFileObject) {
	const file = typeof file_id === 'string' ? findFile(file_id) : file_id;

	switch (file.type) {
		case 'therapy_notes_spreadsheet': {
			await processTNData(file);
			break;
		}
	}
}

async function processTNData(file: DBFileObject) {
	// convert spreadsheet to json
	const content = await getFileContent(file.file_id);
	const wb = xlsx.read(new Uint8Array(content), {
		type: 'array',
	});
	const data: TherapyNotesColumn[] = xlsx.utils.sheet_to_json(
		wb.Sheets[wb.SheetNames[0]]
	);

	await addFileData(
		file.file_id,
		data,
		DataTypes.therapy_notes_spreadsheet.version
	);
}
