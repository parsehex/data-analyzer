import math from '@/math';
import { TableDataObject, TableRowObject } from '@/types/components';
import { $ } from '@/lib/utils';
import { Appointment } from '../../parse';

export default function owes(appts: Appointment[]): TableRowObject {
	const patientOwes = appts.map((appt) => {
		// if (appt.patient.balance.isPaidInFull) return 0;
		return appt.patient.balance.owes;
	});
	const patientOwesSum = math.sum(patientOwes);

	const insuranceOwes = appts.map((appt) => {
		// if (appt.insurance.balance.isPaidInFull) return 0;
		return appt.insurance.balance.owes;
	});
	const insuranceOwesSum = math.sum(insuranceOwes);

	const patient: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (patientOwes.length > 0) {
		patient.text = $(patientOwesSum);
		patient.value = patientOwesSum;
		patient.title = `Owed from ${patientOwes.length} sessions`;
	}

	const insurance: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (insuranceOwes.length > 0) {
		insurance.text = $(insuranceOwesSum);
		insurance.value = insuranceOwesSum;
		insurance.title = `Owed from ${insuranceOwes.length} sessions`;
	}

	return {
		'Patient Owes': patient,
		'Insurance Owes': insurance,
		'Total Owes': {
			value: patientOwesSum + insuranceOwesSum,
			text: $(patientOwesSum + insuranceOwesSum),
		},
	};
}
