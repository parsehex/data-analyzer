import { reactive } from 'vue';
import * as Excel from 'exceljs';

interface State {
	wb: Excel.Workbook;
	files: {
		name: string;
		type: string;
		last_opened: number;
		first_opened: number;
	}[];
}

const state: State = reactive({
	wb: null,
	files: [],
});

export default state;
