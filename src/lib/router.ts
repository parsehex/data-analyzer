import { nextTick } from 'vue';
import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import Home from 'pages/Home.vue';
import Upload from 'pages/Upload.vue';
import File from 'pages/File.vue';
import FileModules from 'file-modules';
import { findFile } from './state';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/upload',
		name: 'Upload',
		component: Upload,
		meta: {
			title: 'Upload - Data Analyzer',
		},
	},
	{
		path: '/file/:id',
		name: 'File',
		component: File,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const DEFAULT_TITLE = 'Data Analyzer';
router.afterEach((to, from) => {
	nextTick(async () => {
		let title = DEFAULT_TITLE;
		if (to.meta.title) {
			title = to.meta.title;
		} else if (to.name === 'File') {
			const file_id = to.params.id as string;
			const file = findFile(file_id);
			const { name_long } = FileModules[file.type];
			title = name_long + ' - ' + DEFAULT_TITLE;
		}
		document.title = title;
	});
});

export default router;
