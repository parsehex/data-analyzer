import * as xlsx from 'xlsx';

interface Options<Col> {
	buffer: ArrayBuffer;
	sheetName: string;
	header?: xlsx.Sheet2JSONOpts['header'];
	sort?: keyof Col | ((a: Col, b: Col) => number);
}

export function loadSpreadsheetFile<ColumnType>({
	buffer,
	sheetName,
	header,
	sort,
}: Options<ColumnType>): ColumnType[] {
	// convert spreadsheet to json
	const wb = xlsx.read(new Uint8Array(buffer), {
		type: 'array',
	});
	const sheetIndex = wb.SheetNames.indexOf(sheetName);
	const data: ColumnType[] = xlsx.utils.sheet_to_json(
		wb.Sheets[wb.SheetNames[sheetIndex]],
		{ header }
	);

	if (typeof sort === 'string') {
		// @ts-ignore
		data.sort((a, b) => a[sort] - b[sort]);
	} else if (typeof sort === 'function') {
		data.sort(sort);
	}

	return data;
}
