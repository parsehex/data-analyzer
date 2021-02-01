import { format, isFuture } from 'date-fns';
import { TableRowObject } from '@/types/components';
import { Appointment } from '../../parse';
import { futureAppts } from '../../filter';
import { genNAColumns } from '@/lib/utils';

export default function nextAppt(appts: Appointment[]): TableRowObject {
	appts = futureAppts(appts);
	if (appts.length === 0) return genNAColumns('Next Appointment');

	appts.sort((a, b) => a.date.getTime() - b.date.getTime());

	const appt = appts[0];

	return {
		'Next Appointment': {
			value: appt.date.getTime(),
			text: `${format(appt.date, 'Pp')} / ${appt.clinician}`,
		},
	};
}
