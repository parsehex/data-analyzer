import { FileModuleConfig } from '@/types/file-data';
import TherapyNotes from './TherapyNotes/Spreadsheet.vue';

const FileModules: FileModuleConfig = {
	therapy_notes_spreadsheet: {
		version: 1,
		name: 'therapy_notes_spreadsheet',
		name_long: 'TherapyNotes Spreadsheet',
		component: TherapyNotes,
	},
};

export default FileModules;
