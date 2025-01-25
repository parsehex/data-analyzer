import { perfMark, perfMeasure } from '@/lib/devtools';
import { newDateFromExcel } from '@/lib/utils';
import { FinancialSegmentRow } from '@/types/file-data/financial-sample';

export interface FinancialSegment {
	segment: string;
	country: string;
	product: string;
	discountBand: string;
	unitsSold: number;
	manufacturing: number;
	salePrice: number;
	grossSales: number;
	discounts: number;
	sales: number;
	cogs: number;
	profit: number;
	date: number;
	monthNumber: number;
	monthName: string;
	year: number;
}

export function parseAppointments(data: FinancialSegmentRow[]): FinancialSegment[] {
	perfMark('pA_start');

	const results: FinancialSegment[] = [];

	for (const row of data) {
		const segment = row['Segment'];
		const country = row['Country'];
		const product = row['Product'];
		const discountBand = row['Discount Band'];
		const unitsSold = row['Units Sold'];
		const manufacturing = row['Manufacturing'];
		const salePrice = row['Sale Price'];
		const grossSales = row['Gross Sales'];
		const discounts = row['Discounts'];
		const sales = row['Sales'];
		const cogs = row['COGS'];
		const profit = row['Profit'];
		const date = row['Date'];
		const monthNumber = row['Month Number'];
		const monthName = row['Month Name'];
		const year = row['Year'];

		results.push({
			segment,
			country,
			product,
			discountBand,
			unitsSold,
			manufacturing,
			salePrice,
			grossSales,
			discounts,
			sales,
			cogs,
			profit,
			date,
			monthNumber,
			monthName,
			year,
		});
	}

	perfMark('pA_end');
	perfMeasure('parseAppointments', 'pA_start', 'pA_end');

	return results;
}
