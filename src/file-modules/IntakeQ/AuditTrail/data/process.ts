import { loadSpreadsheetFile } from '@/lib/io';
import { IntakeQRow_AuditTrail } from '@/types/file-data/intakeq';
import { uniqObjectArray } from '@/lib/utils';

export default async function processData_IntakeQAuditTrail(
	buffers: ArrayBuffer[],
	priorData?: IntakeQRow_AuditTrail[]
) {
	const sheet: IntakeQRow_AuditTrail[] = [];
	if (priorData) sheet.push(...priorData);

	for (const buffer of buffers) {
		sheet.push(
			...loadSpreadsheetFile<IntakeQRow_AuditTrail>({
				buffer,
				sheetName: 'export',
				sort: (a, b) => a.Date - b.Date,
			})
		);
	}

	return uniqObjectArray(sheet, 'Id');
}
