<template>
	<container>
		<row class="d-flex justify-content-center">
			<column size="6">
				<alert :type="alertType">{{ alertText }}</alert>
				<div class="input-group mb-3">
					<div class="custom-file">
						<input
							type="file"
							ref="fileInput"
							@change="upload"
							id="file-input"
						/>
						<label class="custom-file-label" for="file-input"
							>Choose file</label
						>
					</div>
				</div>
			</column>
		</row>
	</container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BSType } from '../components/types';
import { saveFile } from '../lib/db';

export default defineComponent({
	data: () => ({
		alertText: 'Select the TherapyNotes export file:',
		alertType: 'primary',
	}),
	setup() {
		return {};
	},

	methods: {
		async upload() {
			const file = ((this.$refs.fileInput as HTMLInputElement)
				.files as FileList)[0];

			const wb = await this.getWB(file);
		},

		getWB(file: File) {
			return new Promise((resolve) => {
				const reader = new FileReader();

				reader.readAsArrayBuffer(file);
				reader.onload = async () => {
					const buffer = reader.result as ArrayBuffer;
					await saveFile(file.name, 'therapynotes', buffer);
				};
			});
		},
	},
});
</script>
