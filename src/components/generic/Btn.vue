<template>
	<button type="button" :class="'btn btn-' + type">
		<slot />
	</button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { BSType } from '../types';

export default defineComponent({
	name: 'btn',
	props: {
		type: {
			type: String as () => BSType | 'link',
			required: true,
		},
	},
	setup(props) {
		return {};
	},
});
</script>
