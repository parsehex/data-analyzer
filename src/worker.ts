import processPNCStatementData from './file-modules/PNC/data/process';
import processTherapyNotesData from './file-modules/TherapyNotes/data/process';
import { ProcessFileOptions } from './lib/data';
import { PNCStatementActivityColumn } from './types/file-data/pnc';
import { TherapyNotesColumn } from './types/file-data/therapy-notes';

self.addEventListener('message', async (message) => {
	const { data } = message;
	self.postMessage(await processFile(data));
});

async function processFile({
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

		case 'pnc_statement_activity': {
			return await processPNCStatementData(
				buffers,
				priorData as PNCStatementActivityColumn[]
			);
		}

		default: {
			console.error('Unknown file type ' + fileType);
			break;
		}
	}
}
