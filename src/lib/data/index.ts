import { DataTypes, TherapyNotesColumn } from '../../data-types';
import { findFile } from '../state';
import * as xlsx from 'xlsx';
import { addFileData, DBFileObject, getFileContent } from '../db';

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

	// TODO clean data
	let spliced = 0;
	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		if (row.Type !== 'Appointment') {
			data.splice(i, 1);
			spliced++;
		}
	}
	console.log('spliced ' + spliced + ' rows');

	await addFileData(
		file.file_id,
		data,
		DataTypes.therapy_notes_spreadsheet.version
	);
}
