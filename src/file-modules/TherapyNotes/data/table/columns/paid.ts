import math from '@/math';
import { TableDataObject, TableRowObject } from '@/types/components';
import { $ } from '@/lib/utils';
import { Appointment } from '../../parse';

export default function paid(appts: Appointment[]): TableRowObject {
	const patientPaid = appts.map((appt) => {
		return appt.patient.balance.paid;
	});
	const patientPaidSum = math.sum(patientPaid);

	const insurancePaid = appts.map((appt) => {
		return appt.insurance.balance.paid;
	});
	const insurancePaidSum = math.sum(insurancePaid);

	const patient: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (patientPaid.length > 0) {
		const sessions = patientPaid.filter((v) => v).length;
		patient.text = $(patientPaidSum);
		patient.value = patientPaidSum;
		if (sessions > 0) patient.title = `Paid from ${sessions} sessions`;
	}

	const insurance: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (insurancePaid.length > 0) {
		insurance.text = $(insurancePaidSum);
		insurance.value = insurancePaidSum;
		insurance.title = `Paid from ${insurancePaid.length} sessions`;
	}

	return {
		'Patient Paid': patient,
		'Insurance Paid': insurance,
		'Paid Total': {
			value: patientPaidSum + insurancePaidSum,
			text: $(patientPaidSum + insurancePaidSum),
		},
	};
}
