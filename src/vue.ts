import { createApp } from 'vue';

import Container from './components/generic/Container.vue';
import Row from './components/generic/Row.vue';
import Column from './components/generic/Column.vue';
import Alert from './components/generic/Alert.vue';

import router from './router';
import App from './App.vue';

export const app = createApp(App);

export function setupVue() {
	app.component(Container.name, Container);
	app.component(Row.name, Row);
	app.component(Column.name, Column);
	app.component(Alert.name, Alert);

	app.use(router);
}
