import { interquartileRange, quantile } from 'simple-statistics';
import numeral from 'numeral';
import { format } from 'date-fns';
import math from '@/math';
import { TableData } from '@/types/components';
import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';
import { newDateFromExcel } from '@/lib/utils';

export type DataMode =
	| 'Appointment Type'
	| 'Billing Method'
	| 'Clinician Name'
	| 'Month'
	| 'Patient Name'
	| 'Primary Insurer Name'
	| 'Secondary Insurer Name'
	| 'Service Description';

export function getTableData(fileData: TherapyNotesColumn[], mode: DataMode) {
	if (!fileData) return [];

	const tableData: TableData = [];

	const results: {
		name: string;
		nameValue?: number;
		sessionTotals: number[];
	}[] = [];
	for (const row of fileData as TherapyNotesColumn[]) {
		if (row.Type !== 'Appointment') continue;

		const pPaid = math.abs(row['Patient Amount Paid'] || 0);
		const iPaid = math.abs(row['Insurance Amount Paid'] || 0);

		// @ts-ignore
		let name = row[mode];
		let nameValue = null as number;
		if (!name) {
			if (mode === 'Primary Insurer Name') name = 'No Insurance';
			if (mode === 'Secondary Insurer Name') name = 'N/A';
			if (mode === 'Patient Name')
				name = row['First Name'] + ' ' + row['Last Name'];
			if (mode === 'Month') {
				const date = newDateFromExcel(row.Date);
				name = format(date, 'MMMM, yyyy');
				nameValue = date.getTime();
			}
		}

		let doc = results.find((d) => d.name === name);
		if (!doc) {
			doc = {
				name,
				nameValue: nameValue as number,
				sessionTotals: [],
			};
			results.push(doc);
		}

		const total = math.add(pPaid, iPaid);

		let value = total.valueOf() as number;
		doc.sessionTotals.push(value);
	}

	for (const doc of results) {
		const average = math.mean(...doc.sessionTotals);
		const median = math.median(...doc.sessionTotals);
		const sum = math.sum(...doc.sessionTotals);
		const q1 = quantile(doc.sessionTotals, 0.25);
		const q3 = quantile(doc.sessionTotals, 0.75);
		const iqr = interquartileRange(doc.sessionTotals);
		const sessions = doc.sessionTotals.length;

		const data = {
			[mode]: {
				value: doc.name,
			},
			Average: {
				text: `$${numeral(average).format('0,0.00')}`,
				value: average,
			},
			Q1: {
				text: `$${numeral(q1).format('0,0.00')}`,
				value: q1,
			},
			Median: {
				text: `$${numeral(median).format('0,0.00')}`,
				value: median,
			},
			Q3: {
				text: `$${numeral(q3).format('0,0.00')}`,
				value: q3,
			},
			IQR: {
				text: `$${numeral(iqr).format('0,0.00')}`,
				value: iqr,
			},
			'Total Earnings': {
				text: `$${numeral(sum).format('0,0.00')}`,
				value: sum,
			},
			'Total Sessions': {
				text: `${numeral(sessions).format('0,0')}`,
				value: sessions,
			},
		};
		if (mode === 'Month') {
			data[mode].value = doc.nameValue;
			data[mode].text = doc.name;
		}

		tableData.push(data);
	}

	return tableData;
}
