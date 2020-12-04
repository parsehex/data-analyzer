<template>
	<row centered>
		<column>
			<h1 class="lead text-center file-name">
				{{ fileType.name_long }}
			</h1>

			<component :is="fileType.component" :file-data="data.file_data || []" />
		</column>
	</row>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
	import state from '../lib/state';
	import * as xlsx from 'xlsx';
	import db, { DBFileDataObject, getFileData } from '../lib/db';
	import { clone } from '../lib/utils';
	import tippy from 'tippy.js';
	import { DataTypes } from '../file-modules';

	export default defineComponent({
		props: {
			id: {
				type: String,
				required: true,
			},
		},
		data: () => ({
			data: {} as DBFileDataObject,
		}),
		setup(props) {
			const file = computed(() =>
				state.files.find((f) => f.file_id === props.id)
			);

			const fileType = computed(() => DataTypes[file.value.type]);

			const now = Date.now() / 1000;
			if (now - file.value.last_opened <= 45) {
				// update file's last_opened
				file.value.last_opened = Date.now() / 1000;
				db.table('files')
					.where('file_id')
					.equals(props.id)
					.modify({ last_opened: file.value.last_opened });
			}

			return { file, fileType };
		},
		async mounted() {
			this.data = await getFileData(this.file.file_id);

			tippy('h1.file-name', {
				content: this.file.name,
				animation: 'shift-toward',
				delay: 1500,
			});
		},
	});
</script>
