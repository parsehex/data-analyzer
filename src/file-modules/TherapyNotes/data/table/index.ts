import { interquartileRange, quantile } from 'simple-statistics';
import numeral from 'numeral';
import { format, isFuture } from 'date-fns';
import math from '@/math';
import { TableDataObject, TableRowObject } from '@/types/components';
import { $ } from '@/lib/utils';
import { Appointment } from '..';

export type DataMode =
	| 'Appointment Type'
	| 'Billing Method'
	| 'Clinician Name'
	| 'Month'
	| 'Patient Name'
	| 'Primary Insurer Name'
	| 'Secondary Insurer Name'
	| 'Service Description'

export function basicStatCols(appts: Appointment[]): TableRowObject {
	const totals = appts.map((a) => a.total.paid);
	const average = math.mean(...totals);
	const median = math.median(...totals);
	const q1 = quantile(totals, 0.25);
	const q3 = quantile(totals, 0.75);
	const iqr = interquartileRange(totals);

	return {
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
	};
}

export function rpsCols(appts: Appointment[]): TableRowObject {
	const totals = appts.map((a) => a.total.paid);
	const sum = math.sum(totals);
	const sessions = totals.length;

	return {
		'Total Earnings': {
			text: $(sum),
			value: sum,
		},
		'Total Sessions': {
			text: numeral(sessions).format('0,0'),
			value: sessions,
		},
	};
}

export function owesCols(appts: Appointment[]): TableRowObject {
	const patientOwes = appts.map((appt) => {
		// if (appt.patient.balance.isPaidInFull) return 0;
		return appt.patient.balance.owes;
	});
	const insuranceOwes = appts.map((appt) => {
		// if (appt.insurance.balance.isPaidInFull) return 0;
		return appt.insurance.balance.owes;
	});

	const patient: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (patientOwes.length > 0) {
		const owes = math.sum(...patientOwes);
		patient.text = $(owes);
		patient.value = owes;
		patient.title = `Owed from ${patientOwes.length} sessions`;
	}

	const insurance: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (insuranceOwes.length > 0) {
		const owes = math.sum(...insuranceOwes);
		insurance.text = $(owes);
		insurance.value = owes;
		insurance.title = `Owed from ${insuranceOwes.length} sessions`;
	}

	return {
		'Patient Owes': patient,
		'Insurance Owes': insurance,
	};
}

export function nextApptCol(appts: Appointment[]): TableRowObject {
	const futureAppts = appts.filter((a) => isFuture(a.date));

	if (futureAppts.length === 0) {
		return {
			'Next Appointment': {
				value: -1,
				text: 'N/A',
			},
		};
	}

	futureAppts.sort((a, b) => a.date.getTime() - b.date.getTime());

	const appt = futureAppts[0];

	return {
		'Next Appointment': {
			value: appt.date.getTime(),
			text: `${format(appt.date, 'Pp')} / ${appt.clinician}`,
		},
	};
}
