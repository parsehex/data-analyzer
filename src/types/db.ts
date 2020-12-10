export type FileType = 'therapy_notes_spreadsheet';

export interface DBFileObject<FileDataType> {
	file_id: string;
	name: string;
	type: FileType;
	content: FileDataType;
	last_opened: number;
	first_opened: number;
	version: number;
}
