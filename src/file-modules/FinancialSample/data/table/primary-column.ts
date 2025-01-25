import { format } from 'date-fns';
import { TableDataObject } from '@/types/components';
import { FinancialSegment } from '../parse';
import { DataMode } from '.';

export function getPrimaryColumnValue(
	segment: FinancialSegment,
	mode: DataMode
): TableDataObject {
	switch (mode) {
		case 'Default': {
			return { value: segment.segment };
		}
	}
}
