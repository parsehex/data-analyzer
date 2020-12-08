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
