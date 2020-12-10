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
