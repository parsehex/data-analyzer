export type BootstrapType =
	| 'primary'
	| 'secondary'
	| 'light'
	| 'dark'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info';

export type TableDataType = string | number;

export interface TableDataObject {
	text?: string;
	title?: string;
	value: TableDataType;
}

export type TableRowObject = {
	[columnName: string]: TableDataObject;
};

export type TableData = TableRowObject[];

export type ToggleOptions = { [key: string]: boolean };

export interface DateObject {
	day: number;
	month: number;
	year: number;
}
