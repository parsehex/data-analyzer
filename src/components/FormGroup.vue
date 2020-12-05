<template>
	<div :class="'form-group'">
		<slot />
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'FormGroup',
		setup(props) {
			return {};
		},
	});
</script>
