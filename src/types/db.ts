export type FileType = 'therapy_notes_spreadsheet' | 'pnc_statement_activity';

export interface DBFileObject<FileDataType> {
	file_id: string;
	name: string;
	type: FileType;
	content: FileDataType;
	last_opened: number;
	first_opened: number;
	version: number;
}
