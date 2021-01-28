import { defineComponent } from 'vue';
import { FileType } from '../db';

export type FileModuleConfig = { [key in FileType]: DataTypeConfig };

export interface DataTypeConfig {
	version: number;
	name: FileType;
	name_long: string;
	component: ReturnType<typeof defineComponent>;
	mergeable: boolean;
	description?: string;
	reports?: string[];
	dataSource: string;
}
