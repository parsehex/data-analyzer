import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';

export default async function processTherapyNotesData(buffers: ArrayBuffer[]) {
	const sheet: TherapyNotesColumn[] = [];

	for (const buffer of buffers) {
		sheet.push(
			...loadSpreadsheetFile<TherapyNotesColumn>({
				buffer,
				sheetName: 'Billing Transactions',
				sort: 'Date',
			})
		);
	}

	return sheet;
}
