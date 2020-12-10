import { FileType } from '@/types/db';
import processTherapyNotesData from '@/file-modules/TherapyNotes/data/process';
import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';

interface ProcessFileOptions {
	buffers: ArrayBuffer[];
	fileType: FileType;
	priorData?: unknown;
}

/**
 * Accepts an array of ArrayBuffers from FileReader and
 * returns JSON-compatible merged data processed by the provided `type`.
 */
export async function processFile({
	buffers,
	fileType,
	priorData,
}: ProcessFileOptions): Promise<unknown> {
	switch (fileType) {
		case 'therapy_notes_spreadsheet': {
			return await processTherapyNotesData(
				buffers,
				priorData as TherapyNotesColumn[]
			);
		}

		default: {
			console.error('Unknown file type ' + fileType);
			break;
		}
	}
}
