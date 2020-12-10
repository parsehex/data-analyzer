import { FileModuleConfig } from '@/types/file-data';
import TherapyNotes from './TherapyNotes/Spreadsheet.vue';
import PNCStatement from './PNC/Statement.vue';

const FileModules: FileModuleConfig = {
	therapy_notes_spreadsheet: {
		version: 1,
		name: 'therapy_notes_spreadsheet',
		name_long: 'TherapyNotes Spreadsheet',
		component: TherapyNotes,
		mergeable: true,
	},
	pnc_statement: {
		version: 1,
		name: 'pnc_statement',
		name_long: 'PNC Statement',
		component: PNCStatement,
		mergeable: true,
	},
};

export default FileModules;
