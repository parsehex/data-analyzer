import { interquartileRange, quantile } from 'simple-statistics';
import math from '@/math';
import { TableRowObject } from '@/types/components';
import { $, genNAColumns } from '@/lib/utils';
import { FinancialSegment } from '../../parse';

export default function defaultMode(segment: FinancialSegment): TableRowObject {
	return {
		// Segment: {
		// 	text: $(average),
		// 	value: average,
		// },
		Segment: {
			text: segment.segment,
			value: segment.segment,
		},
		Country: {
			text: segment.country,
			value: segment.country,
		},
		Product: {
			text: segment.product,
			value: segment.product,
		},
		'Discount Band': {
			text: segment.discountBand,
			value: segment.discountBand,
		},
	};
}
