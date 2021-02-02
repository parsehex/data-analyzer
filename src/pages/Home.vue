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
							<div
								class="d-flex w-100 justify-content-between align-items-center file"
							>
								<h6>{{ getFileTypeDef(f.type).name_long }}</h6>
								<div class="d-flex flex-row">
									<btn
										@click.stop.capture.prevent="removeFile(f.file_id)"
										size="xs"
										type="danger"
										title="Delete file"
										centered
									>
										<icon :size="14" type="trash-2" />
									</btn>
								</div>
							</div>
							<div
								class="available-reports"
								v-if="getFileTypeDef(f.type).reports"
							>
								<small>Includes</small>
								<ul>
									<li v-for="r in getFileTypeDef(f.type).reports" :key="r">
										{{ r }}
									</li>
								</ul>
							</div>
							<small>opened {{ getLastOpenedLabel(f.last_opened) }}</small>
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
	import { DBFileObject, FileType } from '@/types/db';

	export default defineComponent({
		data: () => ({ isDev: state.isDev }),
		mounted() {
			if (state.files.length === 0) router.replace('/upload');
		},
		methods: {
			getFileTypeDef: (type: FileType) => FileModules[type],
			getLastOpenedLabel(time: number) {
				return formatDistanceToNow(fromUnixTime(time), {
					addSuffix: true,
				});
			},
			removeFile,
		},
		computed: {
			files(): DBFileObject<unknown>[] {
				return state.files.filter((v) => {
					const type = this.getFileTypeDef(v.type);
					return !type.disabled;
				});
			},
		},
	});
</script>

<style lang="scss">
	h6 {
		line-height: 1;
	}
	div.file {
		h6 {
			margin-bottom: 0;
		}
	}
	div.available-reports {
		ul {
			list-style-type: none;
			padding: 0;

			li {
				line-height: 1.2;
				padding: 0 5px;
				// font-style: italic;
				font-weight: bold;
				font-size: 0.85em;
				display: inline-block;

				&:not(:last-of-type) {
					border-right: 1px dashed lightgray;
				}
			}
		}
	}
</style>
