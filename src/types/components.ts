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
	value: TableDataType;
}

export type TableData = {
	[columnName: string]: TableDataObject;
}[];

export type ToggleOptions = { [key: string]: boolean };
