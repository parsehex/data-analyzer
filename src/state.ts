import { reactive } from 'vue';

interface State {
	isLoaded: boolean;
}

const state: State = reactive({
	isLoaded: false,
});

export default state;
