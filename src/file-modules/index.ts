import { FileModuleConfig } from '@/types/file-data';
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
	},
	therapy_notes_spreadsheet: {
		version: 1,
		name: 'therapy_notes_spreadsheet',
		dataSource: 'TherapyNotes',
		name_long: 'Billing Transactions',
		reports: ['% Collected', 'Revenue Per Session', 'Write Offs'],
		component: TherapyNotes,
		mergeable: true,
	},
};

export default FileModules;
