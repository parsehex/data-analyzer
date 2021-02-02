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
		const newData = loadSpreadsheetFile<IntakeQRow_AuditTrail>({
			buffer,
			sheetName: 'export',
		});
		sheet.push(...newData);
	}

	sheet.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

	return uniqObjectArray(sheet, 'Id');
}
