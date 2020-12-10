import { format, parse } from 'date-fns';
import numeral from 'numeral';
import { TableData } from '@/types/components';
import { PNCStatementColumn } from '@/types/file-data/pnc';

export function getTableData(fileData: PNCStatementColumn[] = []) {
	const tableData: TableData = [];

	for (const row of fileData) {
		const date = parse(row.Date, 'yyyy/MM/dd', new Date());
		tableData.push({
			Date: {
				value: date.getTime(),
				text: format(date, 'P'),
			},
			Amount: {
				value: +row.Amount,
				text: `$${numeral(row.Amount).format('0,0.00')}`,
			},
			Description: {
				value: row.Description,
			},
			'Description Cont.': {
				value: row['Description Cont.'],
			},
			'Reference No.': {
				value: row['Reference No.'],
			},
			Type: {
				value: row.Type,
			},
		});
	}

	return tableData;
}
