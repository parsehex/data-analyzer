import { FileType } from '@/types/db';
import processTherapyNotesData from '@/file-modules/TherapyNotes/data/process';

/**
 * Accepts an ArrayBuffer from FileReader and
 * returns JSON-compatible data processed by the provided `type`.
 */
export async function processFile(
	buffer: ArrayBuffer,
	fileType: FileType
): Promise<unknown> {
	switch (fileType) {
		case 'therapy_notes_spreadsheet': {
			return await processTherapyNotesData(buffer);
			break;
		}
	}
}
