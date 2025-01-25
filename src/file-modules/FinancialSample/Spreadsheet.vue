<template>
	<div>
		<div class="form-inline d-print-none my-2">
			<form-group class="px-2">
				<label for="mode">Results Mode:</label>
				<select class="form-control mx-2" id="mode" v-model="filters.mode">
					<option>Default</option>
				</select>
			</form-group>
			<form-group class="px-2">
				<toggle-dropdown
					label="Toggle Columns"
					label-type="info"
					v-model="columns"
				/>
			</form-group>
			<form-group>
				<btn
					@click="download"
					id="download-results"
					size="sm"
					type="success"
					centered
					outline
				>
					<icon :size="12" type="download" />
					Download Results
				</btn>
			</form-group>
		</div>
		<data-table
			:data="rowData"
			:column-states="columns"
			default-sort="Segment"
			:default-reverse="true"
			small
			bordered
			sticky-header
		/>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, PropType, watch } from 'vue';
	import * as xlsx from 'xlsx';
	import { getFile } from '@/lib/db';
	import { clone, $ } from '@/lib/utils';
	import state from '@/lib/state';
	import { loadSettings, saveSettings } from '@/lib/settings';
	import {
		TableData,
		TableDataObject,
		TableRowObject,
	} from '@/types/components';
	import { DataMode } from './data/table';
	import { FinancialSegment } from './data/parse';
	import { FinancialSegmentRow } from '@/types/file-data/financial-sample';

	const DataID = 'financial-segments-sample';
	const DataVersion = 1;

	interface TableResult {
		cell: TableDataObject;
		name: string;
		value?: number;
		segments: FinancialSegment[]
	}

	export default defineComponent({
		name: 'FinancialSegmentsSampleSpreadsheet',
		props: {
			fileData: {
				type: Object as PropType<FinancialSegmentRow[]>,
				required: true,
			},
		},
		data() {
			const DefaultData = {
				isDev: state.isDev,
				filters: {
					mode: 'Default' as DataMode,
				},
				columns: {
					// show all columns
				},
			};

			const loadedData = loadSettings(DataID, DefaultData, DataVersion);
			loadedData.isDev = state.isDev;

			return loadedData;
		},
		mounted() {
			watch(
				[this.$data],
				() => {
					saveSettings(DataID, this.$data, DataVersion);
				},
				{ deep: true }
			);
		},
		computed: {
			rowData() {
				const firstRow = this.fileData[0];
				const keys = Object.keys(firstRow);
				return this.fileData.map((row: any) => {
					let obj = {};
					for (const key of keys) {
						const value = row[key];
						const data = {text:value, value};
						// TODO if column is Month Name, use month number for value
						obj = {
							...obj,
							[key]: data
						}
					}
					return obj;
				})
			},
		},
		methods: {
			download() {
				const el = document.querySelector('table');

				if (state.headless) {
					const csv = xlsx.utils.sheet_to_csv(xlsx.utils.table_to_sheet(el));
					(window as any).result = csv;
					return;
				}

				const wb = xlsx.utils.table_to_book(el);
				const mode = this.filters.mode.replace(/ /g, '');

				const now = new Date();
				const dt = now.getMonth() + 1 / now.getDate();
				const title = `FinancialSegmentsSample_Spreadsheet_${mode}-${dt}.csv`;
				xlsx.writeFile(wb, title);
			},
		},
	});
</script>
