<template>
	<row class="d-flex justify-content-center">
		<column class="col-lg-6">
			<alert :type="alertType">
				Select the type of file to add:
				<select v-model="dataType">
					<option value="pnc_statement_activity">PNC Statement Activity</option>
					<option value="therapy_notes_spreadsheet">TherapyNotes</option>
				</select>
				<!-- TODO add export instructions -->
			</alert>
			<div v-if="dataType" class="input-group mb-3">
				<div class="custom-file">
					<input
						type="file"
						ref="fileInput"
						@change="upload"
						id="file-input"
						multiple
					/>
					<label class="custom-file-label" for="file-input">Choose file</label>
				</div>
			</div>
			<progress-bar
				v-if="isLoading"
				label="Loading..."
				type="primary"
				:value="100"
				striped
				animated
			/>
		</column>
	</row>
</template>

<script lang="ts">
	import { defineComponent, nextTick } from 'vue';
	import { BootstrapType } from '@/types/components';
	import { addFile, updateFile, updateFilesList } from '@/lib/db';
	import router from '@/lib/router';
	import { processFile } from '@/lib/data';
	import { DBFileObject, FileType } from '@/types/db';
	import FileModules from '@/file-modules';

	export default defineComponent({
		data: () => ({
			alertType: 'primary',
			isLoading: false,
			dataType: '' as FileType,
		}),

		methods: {
			async upload() {
				this.isLoading = true;
				const { files } = this.$refs.fileInput as HTMLInputElement;

				const buffers: ArrayBuffer[] = [];
				const file_names: string[] = [];

				for (const key in files) {
					if (!files.hasOwnProperty(key)) continue;
					const file = files[key];

					buffers.push(await this.uploadFile(file));
					file_names.push(file.name);
				}
				const fileData = await processFile({
					buffers,
					fileType: this.dataType,
				});
				const newFile = await addFile({
					name: FileModules[this.dataType].name_long,
					type: this.dataType,
					content: fileData,
					version: FileModules[this.dataType].version,
					file_names,
				});
				await updateFilesList();

				this.isLoading = false;
				nextTick(() => router.replace('/file/' + newFile.file_id));
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
