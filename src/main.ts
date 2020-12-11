import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'tippy.js/dist/tippy.css';
// import 'tippy.js/animations/scale.css';
import { initDB, updateFilesList } from 'lib/db';
import { app, setupVue } from 'lib/vue';

(async () => {
	await initDB();
	await updateFilesList();
	setupVue();
	app.mount('#app');
})();
