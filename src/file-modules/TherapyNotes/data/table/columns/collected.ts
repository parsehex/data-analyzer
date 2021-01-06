import math from '@/math';
import { TableDataObject, TableRowObject } from '@/types/components';
import { $ } from '@/lib/utils';
import { Appointment } from '../../parse';

export default function collected(appts: Appointment[]): TableRowObject {
	const paid: number = math.sum(appts.map((appt) => appt.total.paid));
	const expected: number = math.sum(appts.map((appt) => appt.total.expected));

	let collected = (paid / expected) * 100;
	if (paid === 0) collected = 0;

	return {
		'Total Expected': {
			value: expected,
			text: $(expected),
		},
		'Collected %': {
			value: collected,
			text: `${collected.toFixed(2)}%`,
		},
	};
}
