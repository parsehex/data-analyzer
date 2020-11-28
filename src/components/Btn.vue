<template>
	<button
		type="button"
		:class="[
			'btn',
			'btn-' + (outline ? 'outline-' : '') + type,
			size ? 'btn-' + size : '',
			centered ? 'd-flex justify-content-center align-items-center' : '',
		]"
	>
		<slot />
	</button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { BootstrapType } from './types';

export default defineComponent({
	name: 'btn',
	props: {
		type: {
			type: String as () => BootstrapType,
			required: true,
		},
		size: String as () => 'sm' | 'lg',
		outline: Boolean,
		centered: Boolean,
	},
	setup(props) {
		return {};
	},
});
</script>
