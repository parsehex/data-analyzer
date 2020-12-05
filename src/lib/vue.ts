import { createApp } from 'vue';

import Alert from '../components/Alert.vue';
import Btn from '../components/Btn.vue';
import Column from '../components/Layout/Column.vue';
import Container from '../components/Layout/Container.vue';
import DataTable from '../components/DataTable/DataTable.vue';
import FormGroup from '../components/FormGroup.vue';
import Icon from '../components/Icon.vue';
import ListGroup from '../components/ListGroup/ListGroup.vue';
import ListGroupItem from '../components/ListGroup/ListGroupItem.vue';
import ListGroupLink from '../components/ListGroup/ListGroupLink.vue';
import ProgressBar from '../components/ProgressBar.vue';
import Row from '../components/Layout/Row.vue';
import Spinner from '../components/Spinner.vue';

import router from './router';
import App from '../App.vue';

export const app = createApp(App);

export function setupVue() {
	app.component(Alert.name, Alert);
	app.component(Btn.name, Btn);
	app.component(Column.name, Column);
	app.component(Container.name, Container);
	app.component(DataTable.name, DataTable);
	app.component(FormGroup.name, FormGroup);
	app.component(Icon.name, Icon);
	app.component(ListGroup.name, ListGroup);
	app.component(ListGroupItem.name, ListGroupItem);
	app.component(ListGroupLink.name, ListGroupLink);
	app.component(ProgressBar.name, ProgressBar);
	app.component(Row.name, Row);
	app.component(Spinner.name, Spinner);

	app.use(router);
}
