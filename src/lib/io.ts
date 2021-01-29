import * as xlsx from 'xlsx';

interface Options<Col> {
	buffer: ArrayBuffer;
	sheetName: string;
	header?: xlsx.Sheet2JSONOpts['header'];
	sort?: keyof Col | ((a: Col, b: Col) => number);
	cellDates?: boolean;
	raw?: boolean;
}

export function loadSpreadsheetFile<ColumnType>({
	buffer,
	sheetName,
	header,
	sort,
	cellDates,
	raw,
}: Options<ColumnType>): ColumnType[] {
	// convert spreadsheet to json
	const wb = xlsx.read(new Uint8Array(buffer), {
		type: 'array',
		cellDates,
		raw,
	});

	let sheetIndex = wb.SheetNames.indexOf(sheetName);
	if (sheetIndex === -1) {
		if (wb.SheetNames.length === 1) sheetIndex = 0;
		else {
			throw new Error('Invalid sheetName');
		}
	}

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

export async function uploadFiles(files: FileList) {
	const buffers: ArrayBuffer[] = [];
	const file_names: string[] = [];

	for (const key in files) {
		if (!files.hasOwnProperty(key)) continue;
		const file = files[key];

		buffers.push(await uploadFile(file));
		file_names.push(file.name);
	}
	return { buffers, file_names };
}

function uploadFile(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = async () => {
			resolve(reader.result as ArrayBuffer);
		};
	});
}
