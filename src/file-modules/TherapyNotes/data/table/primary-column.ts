import { format } from 'date-fns';
import { TableDataObject } from '@/types/components';
import { DataMode } from '.';
import { Appointment } from '..';

export function getPrimaryColumnValue(
	appt: Appointment,
	mode: DataMode
): TableDataObject {
	switch (mode) {
		case 'Appointment Type': {
			return { value: appt.type };
		}
		case 'Billing Method': {
			return { value: appt.billingMethod };
		}
		case 'Clinician Name': {
			return { value: appt.clinician };
		}
		case 'Month': {
			return {
				value: appt.date.getMonth(),
				text: format(appt.date, 'MMMM, yyyy'),
			};
		}
		case 'Patient Name': {
			return { value: appt.patient.name };
		}
		case 'Primary Insurer Name': {
			return { value: appt.insurance.primaryName };
		}
		case 'Secondary Insurer Name': {
			return { value: appt.insurance.secondaryName };
		}
		case 'Service Description': {
			return { value: appt.serviceType };
		}
	}
}
