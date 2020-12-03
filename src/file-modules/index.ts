import { defineComponent } from 'vue';

import TherapyNotesSpreadsheet from './TherapyNotes/Spreadsheet.vue';

interface DataTypeConfig {
	version: number;
	name: string;
	name_long: string;
	component: ReturnType<typeof defineComponent>;
}
export const DataTypes: { [key: string]: DataTypeConfig } = {
	therapy_notes_spreadsheet: {
		version: 1,
		name: 'therapy_notes_spreadsheet',
		name_long: 'TherapyNotes Spreadsheet',
		component: TherapyNotesSpreadsheet,
	},
};
