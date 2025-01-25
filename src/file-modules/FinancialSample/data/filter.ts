import { differenceInCalendarDays, isFuture } from 'date-fns';
import { now } from '@/lib/utils';
import { FinancialSegment } from './parse';
import { DataMode } from './table';

interface Filters {
	mode: DataMode;
}

export function filterAppointments(appts: FinancialSegment[], { mode }: Filters) {
	return appts.filter((appt) => {
		if (mode === '% Collected') {
			const { serviceCode } = appt;

			if (!['90837', '90834', '90846', '90847', '90832'].includes(serviceCode))
				return false;
		}

		if (mode === 'Month') {
			if (isFuture(appt.date)) return false;
		}

		if (mode === 'Write Offs') {
			const age = differenceInCalendarDays(now(), appt.date);

			if (age < 180) return false;
			if (appt.patient.balance.owes === 0) return false;
			if (appt.insurance.balance.owes === 0) return false;
		}

		return true;
	});
}

export function pastAppts(appts: FinancialSegment[]) {
	return appts.filter((v) => !isFuture(v.date));
}

export function futureAppts(appts: FinancialSegment[]) {
	return appts.filter((v) => isFuture(v.date));
}
