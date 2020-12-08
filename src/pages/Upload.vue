<template>
	<row class="d-flex justify-content-center">
		<column class="col-lg-6">
			<alert :type="alertType">{{ alertText }}</alert>
			<div class="input-group mb-3">
				<div class="custom-file">
					<input type="file" ref="fileInput" @change="upload" id="file-input" />
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
	import { addFileData, saveFile, updateFilesList } from '@/lib/db';
	import router from '@/lib/router';
	import { processFile } from '@/lib/data';
	import { DBFileObject } from '@/types/db';

	export default defineComponent({
		data: () => ({
			alertText: 'Select the TherapyNotes export file:',
			alertType: 'primary',
			isLoading: false,
		}),

		methods: {
			async upload() {
				this.isLoading = true;
				const fileObj = ((this.$refs.fileInput as HTMLInputElement)
					.files as FileList)[0];

				const file: DBFileObject = await this.uploadFile(fileObj);
				await updateFilesList();
				await processFile(file);

				this.isLoading = false;
				nextTick(() => router.replace('/'));
			},

			uploadFile(file: File): Promise<DBFileObject> {
				return new Promise((resolve) => {
					const reader = new FileReader();

					reader.readAsArrayBuffer(file);
					reader.onload = async () => {
						const buffer = reader.result as ArrayBuffer;
						const f = await saveFile(
							file.name,
							'therapy_notes_spreadsheet',
							buffer
						);
						resolve(f);
					};
				});
			},
		},
	});
</script>
