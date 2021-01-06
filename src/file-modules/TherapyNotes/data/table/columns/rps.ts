import numeral from 'numeral';
import { TableRowObject } from '@/types/components';
import math from '@/math';
import { $ } from '@/lib/utils';
import { Appointment } from '../../parse';

export default function rps(appts: Appointment[]): TableRowObject {
	const totals = appts.map((a) => a.total.paid);
	const sum = math.sum(totals);
	const sessions = totals.length;

	return {
		'Total Revenue': {
			text: $(sum),
			value: sum,
		},
		'Total Sessions': {
			text: numeral(sessions).format('0,0'),
			value: sessions,
		},
	};
}
