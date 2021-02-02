import { TherapyNotesRow } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';
import { lastIndexOf, uniqObjectArray } from '@/lib/utils';
import { perfMark, perfMeasure } from '@/lib/devtools';

export default async function processTherapyNotesData(
	buffers: ArrayBuffer[],
	priorData?: TherapyNotesRow[]
) {
	perfMark('pTND_start');

	let sheet: TherapyNotesRow[] = [];
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

	sheet = uniqObjectArray(sheet, 'ID');

	perfMark('pTND_end');
	perfMeasure('processTherapyNotesData', 'pTND_start', 'pTND_end');

	return sheet;
}

function makeID(row: TherapyNotesRow) {
	let id = '';

	id += row['Date'] + '-';
	id += row['Clinician Name'] + '-';
	id += row['Last Name'] + row['First Name'];

	return id;
}
