import { now } from '@/lib/utils';
import { differenceInCalendarDays } from 'date-fns';
import { Appointment } from '.';
import { DataMode } from './table';

interface Filters {
	mode: DataMode;
}

export function filterAppointments(appts: Appointment[], { mode }: Filters) {
	return appts.filter((appt) => {
		return true;
	});
}
