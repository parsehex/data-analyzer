import { TableData } from '../../components/types';
import { TherapyNotesColumn } from '../../data-types';
import { DBFileDataObject, DBFileObject, getFileData } from '../db';
import { arrayAverage } from '../utils';

export async function getTableData(mode: string, file: DBFileDataObject) {
	if (mode === 'debug') return [{ Result: 'Success' }];
	const data = await getFileData(file.file_id);

	switch (file.type) {
		case 'therapy_notes_spreadsheet': {
			return tnTableData(mode, data.file_data);
		}
	}
}

function tnTableData(mode: string, data: TherapyNotesColumn[]) {
	let tableData: TableData = [];

	switch (mode) {
		// notes: consultations are included in average
		case 'eps': {
			// get all clinicians
			const clinicians: { name: string; sessionTotals: number[] }[] = [];
			for (const row of data) {
				if (!row['Clinician Name']) continue;
				let doc = clinicians.find((d) => d.name === row['Clinician Name']);
				if (!doc) {
					doc = {
						name: row['Clinician Name'],
						sessionTotals: [],
					};
					clinicians.push(doc);
				}

				const total =
					Math.abs(row['Patient Amount Paid'] || 0) +
					Math.abs(row['Insurance Amount Paid'] || 0);
				doc.sessionTotals.push(total);
			}

			for (const doc of clinicians) {
				const average = arrayAverage(doc.sessionTotals);

				tableData.push({
					Clinician: doc.name,
					'Average Earnings Per Session': `$${average.toFixed(2)}`,
					'Total Sessions': doc.sessionTotals.length,
				});
			}

			break;
		}

		case 'raw': {
			// @ts-ignore
			tableData = tableData.concat(data);
			break;
		}
	}

	return tableData;
}
