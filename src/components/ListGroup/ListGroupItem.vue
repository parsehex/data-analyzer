<template>
	<div
		:class="[
			'list-group-item',
			type ? 'list-group-item-' + type : '',
			action ? 'list-group-item-action' : '',
		]"
		@click="handleClick"
	>
		<slot />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import router from '../../lib/router';
import { BootstrapType } from '../types';

export default defineComponent({
	name: 'list-group-item',
	props: {
		type: {
			type: String as () => BootstrapType,
			required: false,
		},
		action: {
			type: String,
			required: false,
		},
	},
	setup(props) {
		return {};
	},
	methods: {
		handleClick() {
			if (this.action) router.push(this.action);
		},
	},
});
</script>
