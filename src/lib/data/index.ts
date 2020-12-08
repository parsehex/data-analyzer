import * as xlsx from 'xlsx';
import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';
import { DBFileObject } from '@/types/db';
import FileModules from '@/file-modules';
import { findFile } from '../state';
import { addFileData, getFileContent } from '../db';

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
	const sheetIndex = wb.SheetNames.indexOf('Billing Transactions');
	const data: TherapyNotesColumn[] = xlsx.utils.sheet_to_json(
		wb.Sheets[wb.SheetNames[sheetIndex]]
	);

	data.sort((a, b) => a.Date - b.Date);

	await addFileData(
		file.file_id,
		data,
		FileModules.therapy_notes_spreadsheet.version
	);
}
