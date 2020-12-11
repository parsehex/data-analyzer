<template>
	<row class="d-flex justify-content-center">
		<column class="col-lg-6">
			<alert :type="alertType">
				Select the type of file to add:
				<select v-model="dataType">
					<option
						v-for="type in fileTypes"
						:key="type.value"
						:value="type.value"
					>
						{{ type.name }}
					</option>
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
			<!-- <progress-bar
				v-if="isLoading"
				label="Loading..."
				type="primary"
				:value="100"
				striped
				animated
			/> -->
		</column>
	</row>
</template>

<script lang="ts">
	import { defineComponent, nextTick } from 'vue';
	import * as Comlink from 'comlink';
	import { BootstrapType } from 'types/components';
	import { addFile, updateFile, updateFilesList } from 'lib/db';
	import router from 'lib/router';
	import { processFile } from 'lib/data';
	import { DBFileObject, FileType } from 'types/db';
	import FileModules from 'file-modules';
	import { uploadFiles } from 'lib/io';
	import state from 'src/lib/state';

	export default defineComponent({
		data: () => ({
			alertType: 'primary',
			isLoading: false,
			dataType: '' as FileType,
		}),

		computed: {
			fileTypes: () => {
				return Object.keys(FileModules).map((value) => ({
					value,
					name: FileModules[value as FileType].name_long,
				}));
			},
		},

		methods: {
			async upload() {
				const { files } = this.$refs.fileInput as HTMLInputElement;
				const { buffers, file_names } = await uploadFiles(files);

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

				nextTick(() => router.replace('/file/' + newFile.file_id));
			},
		},
	});
</script>
