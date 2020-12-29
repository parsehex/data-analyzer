import { TherapyNotesRow } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';
import { lastIndexOf } from '@/lib/utils';

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

	const seenIds: string[] = [];

	const rows = [];

	for (let i = sheet.length - 1; i >= 0; i--) {
		const row = sheet[i];
		const { ID } = row;
		if (seenIds.includes(ID)) {
			continue;
		} else {
			seenIds.push(ID);
			rows.unshift(row);
		}
	}

	return rows;
}

function makeID(row: TherapyNotesRow) {
	let id = '';

	id += row['Date'] + '-';
	id += row['Clinician Name'] + '-';
	id += row['Last Name'] + row['First Name'];

	return id;
}
