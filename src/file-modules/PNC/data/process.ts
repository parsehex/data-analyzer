import { PNCStatementColumn } from '@/types/file-data/pnc';
import { loadSpreadsheetFile } from '@/lib/io';

export default async function processPNCStatementData(
	buffers: ArrayBuffer[],
	priorData?: PNCStatementColumn[]
) {
	const sheet: PNCStatementColumn[] = [];
	if (priorData) sheet.push(...priorData);

	for (const buffer of buffers) {
		const rows = loadSpreadsheetFile<PNCStatementColumn>({
			buffer,
			sheetName: 'DataExport',
			sort: 'Date',
			header: [
				'Date',
				'Amount',
				'Description',
				'Description Cont.',
				'Reference No.',
				'Type',
			],
		});

		// the first row is basically a summary
		rows.splice(0, 1);

		sheet.push(...rows);
	}

	return sheet;
}
