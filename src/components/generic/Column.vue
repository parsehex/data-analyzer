<template>
	<div :class="'col' + (size ? '-' + size : '')">
		<slot />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'column',
	props: {
		size: {
			type: String,
			required: false,
		},
	},
	setup(props) {
		return {};
	},
});
</script>
