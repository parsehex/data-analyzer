export type FileType = 'therapy_notes_spreadsheet';

export interface DBFileDataObject {
	file_id: string;
	type: FileType;
	file_data: any;
}

export interface DBFileObject {
	file_id: string;
	name: string;
	type: FileType;
	content: ArrayBuffer;
	last_opened: number;
	first_opened: number;
}
