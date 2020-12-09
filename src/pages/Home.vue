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
	import { formatDistanceToNow, fromUnixTime } from 'date-fns';
	import router from '@/lib/router';
	import state from '@/lib/state';
	import { removeFile } from '@/lib/db';
	import FileModules from '@/file-modules';

	export default defineComponent({
		data: () => ({ isDev: state.isDev, files: state.files }),
		mounted() {
			if (state.files.length === 0) router.replace('/upload');
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
			removeFile,
		},
	});
</script>
