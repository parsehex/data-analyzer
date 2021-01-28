import { TherapyNotesRow } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';
import { lastIndexOf, uniqObjectArray } from '@/lib/utils';

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

	// add ids to rows
	for (const row of sheet) {
		const id = makeID(row);
		row['ID'] = id;
	}

	return uniqObjectArray(sheet, 'ID');
}

function makeID(row: TherapyNotesRow) {
	let id = '';

	id += row['Date'] + '-';
	id += row['Clinician Name'] + '-';
	id += row['Last Name'] + row['First Name'];

	return id;
}
