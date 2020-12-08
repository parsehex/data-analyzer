<template>
	<div :class="['spinner', type ? 'text-' + type : '']" role="status">
		<span class="sr-only">Loading...</span>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import { BootstrapType } from '@/types/components';

	export default defineComponent({
		name: 'Spinner',
		props: {
			type: {
				type: String as () => BootstrapType,
				default: '',
			},
		},
	});
</script>
