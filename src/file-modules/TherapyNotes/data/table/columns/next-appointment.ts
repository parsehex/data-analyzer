import { format, isFuture } from 'date-fns';
import { TableRowObject } from '@/types/components';
import { Appointment } from '../../parse';

export default function nextAppt(appts: Appointment[]): TableRowObject {
	const futureAppts = appts.filter((a) => isFuture(a.date));

	if (futureAppts.length === 0) {
		return {
			'Next Appointment': {
				value: Number.MIN_VALUE,
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
