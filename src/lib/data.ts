import { FileType } from '@/types/db';
import processTherapyNotesData from '@/file-modules/TherapyNotes/data/process';

/**
 * Accepts an array of ArrayBuffers from FileReader and
 * returns JSON-compatible merged data processed by the provided `type`.
 */
export async function processFile(
	buffers: ArrayBuffer[],
	fileType: FileType
): Promise<unknown> {
	switch (fileType) {
		case 'therapy_notes_spreadsheet': {
			return await processTherapyNotesData(buffers);
			break;
		}
	}
}
