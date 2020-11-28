<template>
	<div :class="['row', centered ? 'd-flex justify-content-center' : '']">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'row',
	props: {
		centered: Boolean,
	},
});
</script>
