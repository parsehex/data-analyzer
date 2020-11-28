import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateFilesList } from './lib/db';
import { app, setupVue } from './lib/vue';

(async () => {
	await updateFilesList();
	setupVue();
	app.mount('#app');
})();
