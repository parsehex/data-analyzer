import { interquartileRange, quantile } from 'simple-statistics';
import numeral from 'numeral';
import { format, isFuture } from 'date-fns';
import math from '@/math';
import { TableData, TableRowObject } from '@/types/components';
import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';
import { $, newDateFromExcel } from '@/lib/utils';

export type DataMode =
	| 'Appointment Type'
	| 'Billing Method'
	| 'Clinician Name'
	| 'Month'
	| 'Patient Name'
	| 'Primary Insurer Name'
	| 'Secondary Insurer Name'
	| 'Service Description'
	| 'Unpaid Patients';

export function getTableData(fileData: TherapyNotesColumn[], mode: DataMode) {
	if (!fileData) return [];

	const tableData: TableData = [];

	const results: {
		name: string;
		nameValue?: number;
		sessionTotals: number[];

		paidInFull?: boolean;
		nextAppointments: {
			clinician: string;
			date: Date;
		}[];
	}[] = [];
	for (const row of fileData as TherapyNotesColumn[]) {
		if (row.Type !== 'Appointment') continue;

		const pPaid = math.abs(row['Patient Amount Paid'] || 0);
		const iPaid = math.abs(row['Insurance Amount Paid'] || 0);

		const rowDate = newDateFromExcel(row.Date);

		// @ts-ignore
		let name = row[mode];
		let nameValue = null as number;
		if (!name) {
			if (mode === 'Primary Insurer Name') name = 'No Insurance';
			if (mode === 'Secondary Insurer Name') name = 'N/A';
			if (mode === 'Patient Name' || mode === 'Unpaid Patients')
				name = row['First Name'] + ' ' + row['Last Name'];
			if (mode === 'Month') {
				name = format(rowDate, 'MMMM, yyyy');
				nameValue = rowDate.getTime();
			}
		}

		let doc = results.find((d) => d.name === name);
		if (!doc) {
			doc = {
				name,
				nameValue: nameValue as number,
				nextAppointments: [],
				sessionTotals: [],
			};
			results.push(doc);
		}

		const total = math.add(pPaid, iPaid);

		let value = total.valueOf() as number;
		doc.sessionTotals.push(value);

		if (mode === 'Unpaid Patients') {
			// since the data should be sorted by date, this value should
			// end up as the most recent entry
			doc.paidInFull = row['Patient Balance Status'] === 'Paid in Full';

			if (isFuture(rowDate)) {
				doc.nextAppointments.push({
					date: rowDate,
					clinician: row['Clinician Name'],
				});
			}
		}
	}

	for (const result of results) {
		if (mode === 'Unpaid Patients') {
			if (result.paidInFull) continue;

			result.nextAppointments.sort(
				(a, b) => a.date.getTime() - b.date.getTime()
			);
		}

		const average = math.mean(...result.sessionTotals);
		const median = math.median(...result.sessionTotals);
		const sum = math.sum(...result.sessionTotals);
		const q1 = quantile(result.sessionTotals, 0.25);
		const q3 = quantile(result.sessionTotals, 0.75);
		const iqr = interquartileRange(result.sessionTotals);
		const sessions = result.sessionTotals.length;

		const data: TableRowObject = {
			[mode]: {
				value: result.name,
			},
			Average: {
				text: $(average),
				value: average,
			},
			Q1: {
				text: $(q1),
				value: q1,
			},
			Median: {
				text: $(median),
				value: median,
			},
			Q3: {
				text: $(q3),
				value: q3,
			},
			IQR: {
				text: $(iqr),
				value: iqr,
			},
			'Total Earnings': {
				text: $(sum),
				value: sum,
			},
			'Total Sessions': {
				text: numeral(sessions).format('0,0'),
				value: sessions,
			},
		};
		if (mode === 'Month') {
			data[mode].value = result.nameValue;
			data[mode].text = result.name;
		} else if (mode === 'Unpaid Patients') {
			let text = 'N/A';
			let value = -1;
			if (result.nextAppointments.length > 0) {
				const appt = result.nextAppointments[0];
				value = appt.date.getTime();
				text = `${format(appt.date, 'P')} with ${appt.clinician}`;
			}
			data['Next Appointment'] = {
				value,
				text,
			};
		}

		tableData.push(data);
	}

	return tableData;
}
