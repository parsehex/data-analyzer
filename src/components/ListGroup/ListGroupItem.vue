<template>
	<div
		:class="[
			'list-group-item',
			type ? 'list-group-item-' + type : '',
			action ? 'list-group-item-action' : '',
		]"
	>
		<slot />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import router from '@/lib/router';
	import { BootstrapType } from '@/types/components';

	export default defineComponent({
		name: 'ListGroupItem',
		props: {
			type: {
				type: String as () => BootstrapType,
				default: '',
			},
			action: {
				type: Boolean,
				default: false,
			},
		},
	});
</script>
