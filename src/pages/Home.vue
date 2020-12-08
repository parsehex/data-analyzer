<template>
	<row centered>
		<container>
			<row>
				<column class="col-12 col-lg-6" centered>
					<h1 class="lead">Recently Opened</h1>
				</column>
				<column class="col-12 col-lg-6">
					<list-group v-for="f in files" :key="f.name">
						<list-group-link :to="'/file/' + f.file_id">
							<div class="d-flex w-100 justify-content-between">
								<h6 class="mb-1">{{ getFileTypeName(f.type) }}</h6>
								<small>opened {{ getLastOpenedLabel(f.last_opened) }}</small>
							</div>
							<small class="d-flex justify-content-between">
								<em>{{ f.name }}</em>
								<div class="d-flex flex-row">
									<btn
										v-if="isDev"
										@click.stop.capture.prevent="processFile(f.file_id)"
										size="sm"
										type="info"
										title="Re-process file"
										outline
										centered
									>
										<icon :size="16" type="refresh-cw" />
									</btn>
									<btn
										@click.stop.capture.prevent="removeFile(f.file_id)"
										size="sm"
										type="danger"
										title="Delete file"
										centered
									>
										<icon :size="16" type="trash-2" />
									</btn>
								</div>
							</small>
						</list-group-link>
					</list-group>

					<span v-if="files.length === 0">
						There are no files.
						<br />
						<router-link to="/upload">Upload</router-link>
						one?
					</span>
				</column>
			</row>
		</container>
	</row>
</template>

<script lang="ts">
	import { defineComponent, reactive } from 'vue';
	import router from '@/lib/router';
	import state from '@/lib/state';
	import { formatDistanceToNow, fromUnixTime } from 'date-fns';
	import { removeFile } from '@/lib/db';
	import { processFile } from '@/lib/data';
	import FileModules from '@/file-modules';

	export default defineComponent({
		data: () => ({ isDev: state.isDev }),
		setup() {
			if (state.files.length === 0) router.replace('/upload');

			return { files: state.files };
		},
		methods: {
			getLastOpenedLabel(time: number) {
				return formatDistanceToNow(fromUnixTime(time), {
					addSuffix: true,
				});
			},
			getFileTypeName(type: string) {
				return FileModules[type].name_long;
			},
			processFile,
			removeFile,
		},
	});
</script>
