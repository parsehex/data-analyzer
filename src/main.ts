import 'bootstrap/dist/css/bootstrap.min.css';
import { app, setupVue } from './vue';

(async () => {
	setupVue();
	app.mount('#app');
})();
