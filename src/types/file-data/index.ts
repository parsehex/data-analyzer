import { defineComponent } from 'vue';

export type FileModuleConfig = { [key: string]: DataTypeConfig };

export interface DataTypeConfig {
	version: number;
	name: string;
	name_long: string;
	component: ReturnType<typeof defineComponent>;
	mergeable: boolean;
}
