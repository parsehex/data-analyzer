import { DBFileObject } from '@/types/db';
import processTherapyNotesData from '@/file-modules/TherapyNotes/data/process';
import { findFile } from './state';

export async function processFile(file_id: string | DBFileObject) {
	const file = typeof file_id === 'string' ? findFile(file_id) : file_id;

	switch (file.type) {
		case 'therapy_notes_spreadsheet': {
			await processTherapyNotesData(file);
			break;
		}
	}
}
