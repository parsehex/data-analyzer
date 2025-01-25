import { format } from 'date-fns';
import { loadSpreadsheetFile } from '@/lib/io';
import { lastIndexOf, newDateFromExcel, uniqObjectArray } from '@/lib/utils';
import { perfMark, perfMeasure } from '@/lib/devtools';
import { FinancialSegmentRow } from '@/types/file-data/financial-sample';

export default async function processTherapyNotesData(
	buffers: ArrayBuffer[],
	priorData?: FinancialSegmentRow[]
) {
	perfMark('pTND_start');

	let sheet: FinancialSegmentRow[] = [];
	if (priorData) sheet.push(...priorData);

	for (const buffer of buffers) {
		sheet.push(
			...loadSpreadsheetFile<FinancialSegmentRow>({
				buffer,
				sheetName: 'Sheet1',
				sort: 'Segment',
			})
		);
	}

	// sheet = uniqObjectArray(sheet, 'ID');

	perfMark('pTND_end');
	perfMeasure('processTherapyNotesData', 'pTND_start', 'pTND_end');

	return sheet;
}
