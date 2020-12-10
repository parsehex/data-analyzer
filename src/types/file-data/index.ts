import { defineComponent } from 'vue';
import { FileType } from '../db';

export type FileModuleConfig = { [key in FileType]: DataTypeConfig };

export interface DataTypeConfig {
	version: number;
	name: string;
	name_long: string;
	component: ReturnType<typeof defineComponent>;
	mergeable: boolean;
}
