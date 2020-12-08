import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { updateFilesList } from '@/lib/db';
import { app, setupVue } from '@/lib/vue';

(async () => {
	await updateFilesList();
	setupVue();
	app.mount('#app');
})();
