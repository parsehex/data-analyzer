<template>
	<div :class="['container' + (fluid ? '-fluid' : '')]"><slot /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'container',
	props: {
		fluid: Boolean,
	},
});
</script>

<style lang="scss"></style>
