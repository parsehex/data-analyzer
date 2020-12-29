import { TherapyNotesRow } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';

export default async function processTherapyNotesData(
	buffers: ArrayBuffer[],
	priorData?: TherapyNotesRow[]
) {
	const sheet: TherapyNotesRow[] = [];
	if (priorData) sheet.push(...priorData);

	for (const buffer of buffers) {
		sheet.push(
			...loadSpreadsheetFile<TherapyNotesRow>({
				buffer,
				sheetName: 'Billing Transactions',
				sort: 'Date',
			})
		);
	}

	return sheet;
}
