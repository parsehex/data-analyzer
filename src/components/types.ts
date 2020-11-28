export type BootstrapType =
	| 'primary'
	| 'secondary'
	| 'light'
	| 'dark'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info';

export type TableData = {
	[columnName: string]: string | number | boolean;
}[];
