<template>
	<row centered>
		<column>
			<h1 class="lead text-center">{{ file.name }}</h1>
			<select v-model="mode">
				<option value="eps">Earnings Per Session</option>
				<!-- <option value="debug">Debug</option>
				<option value="raw">Raw Table</option> -->
			</select>
			<data-table :data="data" small />
		</column>
	</row>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import state from '../lib/state';
import * as xlsx from 'xlsx';
import db, { getFileData } from '../lib/db';
import { getModeData } from '../lib/data/mode';

export default defineComponent({
	props: {
		id: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		// @ts-ignore
		data: [],
		mode: 'eps',
	}),
	setup(props) {
		const file = computed(() =>
			state.files.find((f) => f.file_id === props.id)
		);

		const now = Date.now() / 1000;
		if (now - file.value.last_opened <= 45) {
			// update file's last_opened
			file.value.last_opened = Date.now() / 1000;
			db.table('files')
				.where('file_id')
				.equals(props.id)
				.modify({ last_opened: file.value.last_opened });
		}

		return { file };
	},
	async mounted() {
		this.data = await getModeData(this.mode, this.file);
	},
	watch: {
		async mode() {
			this.data = await getModeData(this.mode, this.file);
		},
	},
});
</script>
