<template>
	<div>
		<navigation title="Data Analyzer" />
		<container fluid>
			<router-view />
		</container>
	</div>
</template>

<script>
	import { defineComponent } from 'vue';
	import Navigation from '@/components/Navigation/Navigation.vue';

	export default defineComponent({
		components: { Navigation },
		name: 'App',
	});
</script>

<style>
	.btn-group-xs > .btn,
	.btn-xs {
		padding: 0.25rem 0.4rem;
		font-size: 0.875rem;
		line-height: 0.5;
		border-radius: 0.2rem;
	}
</style>
