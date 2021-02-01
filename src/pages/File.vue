<template>
	<row centered>
		<column>
			<h1 class="lead text-center file-name">
				{{ fileType.name_long }}
				<span v-if="fileType.mergeable" class="d-print-none">
					<input
						ref="fileInput"
						type="file"
						@change="upload"
						style="display: none"
						multiple
					/>
					<btn @click="addMoreData" size="xs" type="primary" centered outline>
						<icon :size="12" type="plus" />
						Import Data
					</btn>
				</span>
				<btn @click="downloadData" size="xs" type="success" centered outline>
					<icon :size="12" type="download" />
					Export Data
				</btn>
			</h1>

			<component :is="fileType.component" :file-data="file.content || []" />
		</column>
	</row>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
	// import tippy from 'tippy.js';
	import * as xlsx from 'xlsx';
	import state from '@/lib/state';
	import db, { addFile, getFile, updateFile, updateFilesList } from '@/lib/db';
	import { clone, nowSeconds } from '@/lib/utils';
	import { DBFileObject } from '@/types/db';
	import FileModules from '@/file-modules';
	import { DataTypeConfig } from '@/types/file-data';
	import { processFile } from '@/lib/data';
	import { uploadFiles } from '@/lib/io';

	export default defineComponent({
		props: {
			id: {
				type: String,
				required: true,
			},
		},
		data: () => ({ isDev: state.isDev }),
		computed: {
			file(): DBFileObject<unknown> {
				return state.files.find((f) => f.file_id === this.id);
			},
			fileType(): DataTypeConfig {
				return FileModules[this.file.type];
			},
		},
		async mounted() {
			const now = nowSeconds();
			if (now - this.file.last_opened >= 45) {
				// update file's last_opened
				this.file.last_opened = now;
				db.table('files')
					.where('file_id')
					.equals(this.id)
					.modify({ last_opened: now });
			}
		},
		methods: {
			addMoreData() {
				const fileInput = this.$refs.fileInput as HTMLInputElement;
				fileInput.click();
			},
			downloadData() {
				const wb = xlsx.utils.book_new();
				const sheet = xlsx.utils.json_to_sheet(this.file.content as any);
				xlsx.utils.book_append_sheet(wb, sheet);
				xlsx.writeFile(wb, `${this.file.name}-${nowSeconds()}.csv`);
			},
			async upload() {
				const { files } = this.$refs.fileInput as HTMLInputElement;
				const { buffers, file_names } = await uploadFiles(files);

				const fileData = await processFile({
					buffers,
					fileType: this.file.type,
					priorData: this.file.content,
				});
				await updateFile({
					file_id: this.file.file_id,
					content: fileData,
					file_names,
				});
				await updateFilesList();
			},
		},
	});
</script>
