<template>
	<grid>
		<row class="d-flex justify-content-center">
			<column size="6"> Coming Soon </column>
		</row>
	</grid>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '../router';
import state from '../state';

export default defineComponent({
	setup() {
		if (!state.isLoaded) router.replace('/upload');

		return {};
	},
});
</script>
