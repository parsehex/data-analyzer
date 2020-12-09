import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';

export default async function processTherapyNotesData(buffer: ArrayBuffer) {
	return loadSpreadsheetFile<TherapyNotesColumn>({
		buffer,
		sheetName: 'Billing Transactions',
		sort: 'Date',
	});
}
