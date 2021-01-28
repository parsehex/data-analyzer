import { FileType } from '@/types/db';
import processTherapyNotesData from '@/file-modules/TherapyNotes/data/process';
import { TherapyNotesRow } from '@/types/file-data/therapy-notes';
import processPNCStatementData from '@/file-modules/PNC/data/process';
import { PNCStatementActivityColumn } from '@/types/file-data/pnc';
import processData_IntakeQAuditTrail from '@/file-modules/IntakeQ/AuditTrail/data/process';
import { IntakeQRow_AuditTrail } from '@/types/file-data/intakeq';

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
				priorData as TherapyNotesRow[]
			);
		}

		case 'pnc_statement_activity': {
			return await processPNCStatementData(
				buffers,
				priorData as PNCStatementActivityColumn[]
			);
		}

		case 'intakeq_audit_trail': {
			return await processData_IntakeQAuditTrail(
				buffers,
				priorData as IntakeQRow_AuditTrail[]
			);
		}

		default: {
			console.error('Unknown file type ' + fileType);
			break;
		}
	}
}
