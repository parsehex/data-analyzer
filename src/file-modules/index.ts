import { FileModuleConfig } from '@/types/file-data';
import AuditTrail from './IntakeQ/AuditTrail/AuditTrail.vue';
import FinancialSample from './FinancialSample/Spreadsheet.vue';
import TherapyNotes from './TherapyNotes/Spreadsheet.vue';
import PNCStatementActivity from './PNC/Statement.vue';

const FileModules: FileModuleConfig = {
	pnc_statement_activity: {
		version: 1,
		name: 'pnc_statement_activity',
		dataSource: 'PNC',
		name_long: 'Activity Statement',
		component: PNCStatementActivity,
		mergeable: true,
		disabled: true,
	},
	intakeq_audit_trail: {
		version: 1,
		name: 'intakeq_audit_trail',
		dataSource: 'IntakeQ',
		reports: ['Missing Intakes'],
		name_long: 'Audit Trail',
		component: AuditTrail,
		mergeable: true,
		disabled: true,
	},
	therapy_notes_spreadsheet: {
		version: 1,
		name: 'therapy_notes_spreadsheet',
		dataSource: 'TherapyNotes',
		name_long: 'Billing Transactions',
		reports: ['% Collected', 'Revenue Per Session', 'Write Offs'],
		component: TherapyNotes,
		mergeable: true,
		disabled: true,
	},
	financial_sample_spreadsheet: {
		version: 1,
		name: 'financial_sample_spreadsheet',
		dataSource: 'Samples',
		name_long: 'Financial Segments',
		reports: ['Default'],
		component: FinancialSample,
		mergeable: true,
		disabled: false,
	},
};

export default FileModules;
