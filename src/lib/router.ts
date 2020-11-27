import { createWebHistory, createRouter } from 'vue-router';
import Home from '../pages/Home.vue';
import Upload from '../pages/Upload.vue';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/upload',
		name: 'Upload',
		component: Upload,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
