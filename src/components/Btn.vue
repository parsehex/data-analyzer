<template>
	<button
		type="button"
		:class="[
			'btn',
			centered ? 'd-flex justify-content-center align-items-center' : '',
			'btn-' + (outline ? 'outline-' : '') + type,
			size ? 'btn-' + size : '',
		]"
	>
		<slot />
	</button>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import { BootstrapType } from '@/types/components';

	export default defineComponent({
		name: 'Btn',
		props: {
			type: {
				type: String as () => BootstrapType,
				required: true,
			},
			size: {
				type: String as () => '' | 'sm' | 'lg',
				required: false,
				default: '',
			},
			outline: Boolean,
			centered: Boolean,
		},
	});
</script>
