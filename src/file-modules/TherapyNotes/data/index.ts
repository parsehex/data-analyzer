import { newDateFromExcel } from '@/lib/utils';
import { TherapyNotesRow } from '@/types/file-data/therapy-notes';

export interface Appointment {
	/** Appointment Type */
	type: string;
	clinician: string;
	date: Date;
	billingMethod: string;
	serviceType: string;

	insurance: {
		primaryName: string;
		secondaryName: string;
		balance: Balance;
	};
	patient: {
		name: string;
		balance: Balance;
	};

	total: {
		due: number;
		paid: number;
		owes: number;
	};
}
export interface Balance {
	isPaidInFull: boolean;
	isPaidPartial: boolean;
	status: string;
	paid: number;
	due: number;
	owes: number;
}

export function parseAppointments(data: TherapyNotesRow[]): Appointment[] {
	const results: Appointment[] = [];

	for (const row of data) {
		const patientDue = Math.abs(row['Patient Amount Due'] || 0);
		const patientPaid = Math.abs(row['Patient Amount Paid'] || 0);
		const patientOwes = patientDue - patientPaid;

		const insuranceDue = Math.abs(row['Insurance Amount Due'] || 0);
		const insurancePaid = Math.abs(row['Insurance Amount Paid'] || 0);
		const insuranceOwes = insuranceDue - insurancePaid;

		results.push({
			type: row['Appointment Type'],
			clinician: row['Clinician Name'],
			date: newDateFromExcel(row.Date),
			billingMethod: row['Billing Method'],
			serviceType: row['Service Description'],
			insurance: {
				primaryName: row['Primary Insurer Name'] || 'No Insurance',
				secondaryName: row['Secondary Insurer Name'] || 'No Insurance',
				balance: {
					status: row['Insurance Balance Status'],
					isPaidInFull: row['Insurance Balance Status'] === 'Paid',
					isPaidPartial: insurancePaid < insuranceDue,
					due: insuranceDue,
					paid: insurancePaid,
					owes: insuranceOwes,
				},
			},
			patient: {
				name: row['First Name'] + ' ' + row['Last Name'],
				balance: {
					status: row['Patient Balance Status'],
					isPaidInFull: row['Patient Balance Status'] === 'Paid In Full',
					isPaidPartial: patientPaid < patientDue,
					due: patientDue,
					paid: patientPaid,
					owes: patientOwes,
				},
			},
			total: {
				paid: insurancePaid + patientPaid,
				due: insuranceDue + patientDue,
				owes: insuranceOwes + patientOwes,
			},
		});
	}

	return results;
}
