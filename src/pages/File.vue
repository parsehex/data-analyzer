<template>
	<row centered>
		<column>
			<h1 class="lead text-center file-name">
				{{ fileNameLong }}
			</h1>

			<column class="col-xs-12 col-sm-4">
				<select class="form-control" v-model="mode">
					<option value="eps">Earnings Per Session</option>
				</select>
			</column>

			<data-table :data="data" small />
		</column>
	</row>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
	import state from '../lib/state';
	import * as xlsx from 'xlsx';
	import db, { getFileData } from '../lib/db';
	import { getModeData } from '../lib/data/mode';
	import { clone } from '../lib/utils';
	import tippy from 'tippy.js';
	import { DataTypes } from '../data-types';

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

			const fileNameLong = computed(() => DataTypes[file.value.type].name_long);

			const now = Date.now() / 1000;
			if (now - file.value.last_opened <= 45) {
				// update file's last_opened
				file.value.last_opened = Date.now() / 1000;
				db.table('files')
					.where('file_id')
					.equals(props.id)
					.modify({ last_opened: file.value.last_opened });
			}

			return { file, fileNameLong };
		},
		async mounted() {
			this.data = await getModeData(this.mode, this.file);

			tippy('h1.file-name', {
				content: this.file.name,
				animation: 'shift-toward',
				delay: 150,
			});
		},
		watch: {
			async mode() {
				this.data = await getModeData(this.mode, this.file);
			},
		},
	});
</script>
