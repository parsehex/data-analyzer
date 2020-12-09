<template>
	<row centered>
		<column>
			<h1 class="lead text-center file-name">
				{{ fileType.name_long }}
				<span v-if="fileType.mergeable">
					<input
						ref="fileInput"
						type="file"
						@change="upload"
						style="display: none"
						multiple
					/>
					<btn @click="addMoreData" size="sm" type="primary" centered outline>
						<icon :size="16" type="plus" />
						Add More Data
					</btn>
				</span>
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

	export default defineComponent({
		props: {
			id: {
				type: String,
				required: true,
			},
		},
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
			async upload() {
				// state.isLoading = true;
				const { files } = this.$refs.fileInput as HTMLInputElement;

				const buffers: ArrayBuffer[] = [];

				for (const key in files) {
					if (!files.hasOwnProperty(key)) continue;
					const file = files[key];

					buffers.push(await this.uploadFile(file));
				}
				const fileData = await processFile({
					buffers,
					fileType: this.file.type,
					priorData: this.file.content,
				});
				await updateFile({
					file_id: this.file.file_id,
					content: fileData,
				});
				await updateFilesList();

				// state.isLoading = false;
				// nextTick(() => router.replace('/'));
			},
			uploadFile(file: File): Promise<ArrayBuffer> {
				return new Promise((resolve) => {
					const reader = new FileReader();
					reader.readAsArrayBuffer(file);
					reader.onload = async () => {
						resolve(reader.result as ArrayBuffer);
					};
				});
			},
		},
	});
</script>
