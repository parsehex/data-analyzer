export type BootstrapType =
	| 'primary'
	| 'secondary'
	| 'light'
	| 'dark'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info';

export type TableDataType = string | number | boolean;

export type TableData = {
	[columnName: string]: TableDataType;
}[];
