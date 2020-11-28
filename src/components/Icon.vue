<template>
	<svg
		:width="size"
		:height="size"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<use
			:xlink:href="
				'/node_modules/feather-icons/dist/feather-sprite.svg#' + type
			"
		/>
	</svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { BootstrapType } from './types';

export default defineComponent({
	name: 'icon',
	props: {
		type: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			default: 32,
		},
	},
	setup(props) {
		return {};
	},
});
</script>
