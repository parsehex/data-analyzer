<template>
	<container>
		<row class="d-flex justify-content-center">
			<column size="6">
				Recently Opened Spreadsheets
				<div v-for="f in files" :key="f.name">
					{{ f.name }}
				</div>
			</column>
		</row>
	</container>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import router from '../lib/router';
import state from '../lib/state';

export default defineComponent({
	setup() {
		if (state.files.length === 0) router.replace('/upload');

		return { files: state.files };
	},
});
</script>
