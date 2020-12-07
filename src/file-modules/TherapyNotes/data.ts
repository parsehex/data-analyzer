import math from '../../mathjs';
import { interquartileRange, quantile } from 'simple-statistics';
import numeral from 'numeral';
import { TableData } from '../../components/types';
import { TherapyNotesColumn } from '../../data-types';

export type DataMode =
	| 'Appointment Type'
	| 'Billing Method'
	| 'Clinician Name'
	| 'Patient Name'
	| 'Primary Insurer Name'
	| 'Secondary Insurer Name'
	| 'Service Description';

export function getTableData(fileData: TherapyNotesColumn[], mode: DataMode) {
	if (!fileData) return [];

	const tableData: TableData = [];

	const clinicians: {
		name: string;
		sessionTotals: number[];
	}[] = [];
	for (const row of fileData as TherapyNotesColumn[]) {
		if (row.Type !== 'Appointment') continue;

		const pPaid = math.abs(row['Patient Amount Paid'] || 0);
		const iPaid = math.abs(row['Insurance Amount Paid'] || 0);

		// @ts-ignore
		let name = row[mode];
		if (!name) {
			if (mode === 'Primary Insurer Name') name = 'No Insurance';
			if (mode === 'Secondary Insurer Name') name = 'N/A';
			if (mode === 'Patient Name')
				name = row['First Name'] + ' ' + row['Last Name'];
		}

		let doc = clinicians.find((d) => d.name === name);
		if (!doc) {
			doc = {
				name,
				sessionTotals: [],
			};
			clinicians.push(doc);
		}

		const total = math.add(pPaid, iPaid);

		let value = total.valueOf() as number;
		doc.sessionTotals.push(value);
	}

	for (const doc of clinicians) {
		const average = math.mean(...doc.sessionTotals);
		const median = math.median(...doc.sessionTotals);
		const sum = math.sum(...doc.sessionTotals);
		const q1 = quantile(doc.sessionTotals, 0.25);
		const q3 = quantile(doc.sessionTotals, 0.75);
		const iqr = interquartileRange(doc.sessionTotals);
		const sessions = doc.sessionTotals.length;

		tableData.push({
			[mode]: doc.name,
			Average: `$${numeral(average).format('0,0.00')}`,
			Q1: `$${numeral(q1).format('0,0.00')}`,
			Median: `$${numeral(median).format('0,0.00')}`,
			Q3: `$${numeral(q3).format('0,0.00')}`,
			IQR: `$${numeral(iqr).format('0,0.00')}`,
			'Total Earnings': `$${numeral(sum).format('0,0.00')}`,
			'Total Sessions': `${numeral(sessions).format('0,0')}`,
		});
	}

	return tableData;
}
