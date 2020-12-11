import { TherapyNotesColumn } from 'types/file-data/therapy-notes';
import { loadSpreadsheetFile } from 'lib/io';

export default async function processTherapyNotesData(
	buffers: ArrayBuffer[],
	priorData?: TherapyNotesColumn[]
) {
	const sheet: TherapyNotesColumn[] = [];
	if (priorData) sheet.push(...priorData);

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
