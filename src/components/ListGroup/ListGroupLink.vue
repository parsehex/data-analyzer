<template>
	<router-link
		:class="[
			'list-group-item list-group-item-action',
			type ? 'list-group-item-' + type : '',
		]"
		:to="to"
	>
		<slot />
	</router-link>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import router from '@/lib/router';
	import { BootstrapType } from '@/types/components';

	export default defineComponent({
		name: 'ListGroupLink',
		props: {
			type: {
				type: String as () => BootstrapType,
				default: '',
			},
			to: {
				type: String,
				required: true,
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
