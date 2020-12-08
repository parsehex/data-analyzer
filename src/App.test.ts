import { RouterLink, RouterView } from 'vue-router';
import { mount, shallowMount } from '@vue/test-utils';
import App from './App.vue';
import Container from './components/Layout/Container.vue';
import Column from './components/Layout/Column.vue';
import Row from './components/Layout/Row.vue';
import Navigation from './components/Navigation/Navigation.vue';

test('uses shallowMount', async () => {
	const wrapper = mount(App, {
		shallow: true,
		global: {
			components: {
				Container,
				Column,
				Row,
				RouterLink,
				RouterView,
			},
		},
	});

	// console.log(wrapper.html());
});
