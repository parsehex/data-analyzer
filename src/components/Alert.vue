<template>
	<div :class="'alert alert-' + type" role="alert">
		<slot />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import { BootstrapType } from '@/types/components';

	export default defineComponent({
		name: 'Alert',
		props: {
			type: {
				type: String as () => BootstrapType,
				required: true,
			},
		},
		setup(props) {
			return {};
		},
	});
</script>
