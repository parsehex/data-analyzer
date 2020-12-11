import { FileType } from 'types/db';
import state from './state';
import { clone } from './utils';

const worker = new Worker('/worker.js');

export interface ProcessFileOptions {
	buffers: ArrayBuffer[];
	fileType: FileType;
	priorData?: unknown;
}

export function processFile(options: ProcessFileOptions) {
	state.isLoading = true;
	return new Promise((resolve) => {
		const listener = (message: MessageEvent<any>) => {
			const { data } = message;
			worker.removeEventListener('message', listener);
			state.isLoading = false;
			resolve(data);
		};
		worker.addEventListener('message', listener);
		worker.postMessage(clone(options));
	});
}

/**
 * Accepts an array of ArrayBuffers from FileReader and
 * returns JSON-compatible merged data processed by the provided `type`.
 */
// export async function processFile({
// 	buffers,
// 	fileType,
// 	priorData,
// }: ProcessFileOptions): Promise<unknown> {
// 	switch (fileType) {
// 		case 'therapy_notes_spreadsheet': {
// 			return await processTherapyNotesData(
// 				buffers,
// 				priorData as TherapyNotesColumn[]
// 			);
// 		}

// 		case 'pnc_statement_activity': {
// 			return await processPNCStatementData(
// 				buffers,
// 				priorData as PNCStatementActivityColumn[]
// 			);
// 		}

// 		default: {
// 			console.error('Unknown file type ' + fileType);
// 			break;
// 		}
// 	}
// }
