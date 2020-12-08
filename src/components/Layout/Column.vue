<template>
	<div :class="['col', centered ? 'd-flex justify-content-center' : '']">
		<slot />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';

	export default defineComponent({
		name: 'Column',
		props: {
			centered: Boolean,
		},
	});
</script>
