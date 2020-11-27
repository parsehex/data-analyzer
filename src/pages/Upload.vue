<template>
	<container>
		<row class="d-flex justify-content-center">
			<column size="6">
				<alert type="primary">Select the TherapyNotes export file:</alert>
				<input type="file" />
			</column>
		</row>
	</container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	setup() {
		//

		return {};
	},
});
</script>
