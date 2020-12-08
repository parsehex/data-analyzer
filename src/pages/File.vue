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
	import state from '@/lib/state';
	import * as xlsx from 'xlsx';
	import db, { getFileData } from '@/lib/db';
	import { clone } from '@/lib/utils';
	import tippy from 'tippy.js';
	import { DBFileDataObject } from '@/types/db';
	import FileModules from '@/file-modules';

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
		computed: {
			file() {
				return state.files.find((f) => f.file_id === this.id);
			},
			fileType() {
				return FileModules[this.file.type];
			},
		},
		async mounted() {
			this.data = await getFileData(this.file.file_id);

			const now = Date.now() / 1000;
			if (now - this.file.last_opened >= 45) {
				// update file's last_opened
				this.file.last_opened = now;
				db.table('files')
					.where('file_id')
					.equals(this.id)
					.modify({ last_opened: now });
			}

			tippy('h1.file-name', {
				content: this.file.name,
				animation: 'shift-toward',
				delay: 1500,
			});
		},
	});
</script>
