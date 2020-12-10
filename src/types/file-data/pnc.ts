export interface PNCStatementColumn {
	Date: string;
	Amount: number;
	Description: string;
	'Description Cont.': string;
	'Reference No.': number;
	Type: 'DEBIT' | 'CREDIT';
}
