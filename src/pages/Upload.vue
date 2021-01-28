<template>
	<container>
		<row class="d-flex justify-content-center">
			<column class="col-12">
				<alert :type="alertType">
					Select the type of file to add
					<progress-bar
						v-if="isLoading"
						label="Loading..."
						type="primary"
						:value="100"
						striped
						animated
					/>
				</alert>
				<input
					type="file"
					ref="fileInput"
					@change="upload"
					id="file-input"
					multiple
					:style="{ display: 'none' }"
				/>
			</column>
			<column
				class="col-xs-12 col-sm-6 col-md-4"
				v-for="def in fileTypes"
				:key="def.name"
			>
				<card
					type="light"
					:actions="[
						{
							label: 'Choose File(s)...',
							callback: () => chooseType(def.name),
						},
					]"
				>
					<template #header>
						{{ def.dataSource }}
					</template>
					<template #title>
						{{ def.name_long }}
					</template>
				</card>
			</column>
		</row>
	</container>
</template>

<script lang="ts">
	import { defineComponent, nextTick } from 'vue';
	import { addFile, updateFilesList } from '@/lib/db';
	import router from '@/lib/router';
	import { processFile } from '@/lib/data';
	import { FileType } from '@/types/db';
	import FileModules from '@/file-modules';
	import { uploadFiles } from '@/lib/io';

	export default defineComponent({
		data: () => ({
			alertType: 'primary',
			isLoading: false,
			dataType: '' as FileType,
		}),

		computed: {
			fileTypes: () => {
				return Object.values(FileModules);
			},
		},

		methods: {
			chooseType(type: FileType) {
				this.dataType = type;
				(this.$refs.fileInput as HTMLInputElement).click();
			},
			async upload() {
				this.isLoading = true;
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

				this.isLoading = false;
				nextTick(() => router.replace('/file/' + newFile.file_id));
			},
		},
	});
</script>
