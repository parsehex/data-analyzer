<template>
	<div :class="['list-group', flush ? 'list-group-flush' : '']">
		<slot />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import { BootstrapType } from '@/types/components';

	export default defineComponent({
		name: 'ListGroup',
		props: {
			flush: Boolean,
		},
		setup(props) {
			return {};
		},
	});
</script>
