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

	export default defineComponent({
		name: 'App',
	});
</script>
