import { FileModuleConfig } from '@/types/file-data';
import TherapyNotes from './TherapyNotes/Spreadsheet.vue';
import PNCStatementActivity from './PNC/Statement.vue';

const FileModules: FileModuleConfig = {
	pnc_statement_activity: {
		version: 1,
		name: 'pnc_statement_activity',
		name_long: 'PNC Statement Activity',
		component: PNCStatementActivity,
		mergeable: true,
	},
	therapy_notes_spreadsheet: {
		version: 1,
		name: 'therapy_notes_spreadsheet',
		name_long: 'TherapyNotes Spreadsheet',
		component: TherapyNotes,
		mergeable: true,
	},
};

export default FileModules;
