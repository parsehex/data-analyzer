<template>
	<div :class="'alert alert-' + type" role="alert">
		<slot />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { BSType } from '../types';

export default defineComponent({
	name: 'alert',
	props: {
		type: {
			type: String as () => BSType,
			required: true,
		},
	},
	setup(props) {
		return {};
	},
});
</script>
