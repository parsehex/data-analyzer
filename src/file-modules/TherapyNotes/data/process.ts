import FileModules from '@/file-modules';
import { addFileData } from '@/lib/db';
import { DBFileObject } from '@/types/db';
import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';

export default async function processTherapyNotesData(file: DBFileObject) {
	const data = loadSpreadsheetFile<TherapyNotesColumn>({
		content: file.content,
		sheetName: 'Billing Transactions',
		sort: 'Date',
	});

	await addFileData(
		file.file_id,
		data,
		FileModules.therapy_notes_spreadsheet.version
	);
}
