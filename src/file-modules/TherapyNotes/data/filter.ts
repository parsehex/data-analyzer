import { now } from '@/lib/utils';
import { differenceInCalendarDays } from 'date-fns';
import { Appointment } from '.';
import { DataMode } from './table';

interface Filters {
	mode: DataMode;
}

export function filterAppointments(appts: Appointment[], { mode }: Filters) {
	return appts.filter((appt) => {
		if (mode === 'Write Offs') {
			const age = differenceInCalendarDays(now(), appt.date);

			if (age < 180) return false;
			if (appt.patient.balance.owes === 0) return false;
			if (appt.insurance.balance.owes === 0) return false;
		}

		return true;
	});
}
