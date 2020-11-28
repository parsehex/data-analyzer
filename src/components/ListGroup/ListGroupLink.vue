<template>
	<router-link
		:class="[
			'list-group-item',
			type ? 'list-group-item-' + type : '',
			'list-group-item-action',
		]"
		:to="to"
	>
		<slot />
	</router-link>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import router from '../../lib/router';
import { BootstrapType } from '../types';

export default defineComponent({
	name: 'list-group-link',
	props: {
		type: {
			type: String as () => BootstrapType,
			required: false,
		},
		to: {
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
