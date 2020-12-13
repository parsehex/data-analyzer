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
	| 'Service Description';

export function getTableData(fileData: TherapyNotesColumn[], mode: DataMode) {
	if (!fileData) return [];

	const tableData: TableData = [];

	const results: {
		name: string;
		nameValue?: number;
		sessionTotals: number[];

		paidInFull?: boolean;
		patientOwes?: number[];
		nextAppointments?: {
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
			if (mode === 'Patient Name')
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
				sessionTotals: [],
			};
			results.push(doc);
		}

		const total = math.add(pPaid, iPaid);

		let value = total.valueOf() as number;
		doc.sessionTotals.push(value);

		if (mode === 'Patient Name') {
			const owes =
				row['Patient Amount Due'] - Math.abs(row['Patient Amount Paid']);
			doc.patientOwes = doc.patientOwes || [];
			if (owes > 0 && row['Patient Balance Status'] !== 'Paid in Full') {
				doc.patientOwes.push(owes);
			}

			doc.nextAppointments = doc.nextAppointments || [];
			if (isFuture(rowDate)) {
				doc.nextAppointments.push({
					date: rowDate,
					clinician: row['Clinician Name'],
				});
			}
		}
	}

	for (const result of results) {
		if (mode === 'Patient Name') {
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
		} else if (mode === 'Patient Name') {
			data['Owed'] = {
				value: 0,
				text: $(0),
			};
			if (result.patientOwes.length > 0) {
				const owes = math.sum(...result.patientOwes);
				data['Owed'].text = $(owes);
				data['Owed'].value = owes;
				data['Owed'].title = `Owed from ${result.patientOwes.length} sessions`;
			}

			data['Next Appointment'] = {
				value: -1,
				text: 'N/A',
			};
			if (result.nextAppointments.length > 0) {
				const appt = result.nextAppointments[0];

				data['Next Appointment'].value = appt.date.getTime();
				data['Next Appointment'].text = `${format(appt.date, 'P')} with ${
					appt.clinician
				}`;
			}
		}

		tableData.push(data);
	}

	return tableData;
}
