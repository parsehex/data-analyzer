<template>
	<div>
		<div class="form-inline d-print-none my-2">
			<form-group class="px-2">
				<label for="mode">Results Mode:</label>
				<select class="form-control mx-2" id="mode" v-model="filters.mode">
					<option>Missing Intakes</option>
				</select>
			</form-group>
			<form-group v-if="isDev" class="px-2">
				<toggle-dropdown
					label="Toggle Columns"
					label-type="info"
					v-model="columns"
				/>
			</form-group>
			<form-group v-if="isDev">
				<btn @click="download" size="xs" type="success" centered outline>
					<icon :size="16" type="download" />
					Download Results
				</btn>
			</form-group>
		</div>
		<data-table
			:data="tableData"
			default-sort="Status"
			:default-reverse="true"
			small
			bordered
			sticky-header
		/>
	</div>
</template>

<script lang="ts">
	import { defineComponent, PropType, watch } from 'vue';
	import * as xlsx from 'xlsx';
	import { format } from 'date-fns';
	import state from '@/lib/state';
	import { loadSettings, saveSettings } from '@/lib/settings';
	import { TableData, TableRowObject } from '@/types/components';
	import { IntakeQRow_AuditTrail } from '@/types/file-data/intakeq';
	import { missingIntakesResults, MissingIntakes_Result } from './data/results';

	const DataID = 'intakeq-audit-trail';
	const DataVersion = 1;

	export default defineComponent({
		name: 'IntakeQAuditTrail',
		props: {
			fileData: {
				type: Object as PropType<IntakeQRow_AuditTrail[]>,
				required: true,
			},
		},
		data() {
			const DefaultData = {
				isDev: state.isDev,
				filters: {
					mode: 'Missing Intakes',
				},
				columns: {},
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
			results() {
				let results: any[];

				switch (this.filters.mode) {
					case 'Missing Intakes': {
						results = missingIntakesResults(this.fileData);
						break;
					}

					default: {
						throw new Error('Unknown results mode');
					}
				}

				return results;
			},
			tableData(): TableData {
				const clients: MissingIntakes_Result[] = this.results;
				const tableData: TableData = [];

				const { mode } = this.filters;
				for (const client of clients) {
					const cols: TableRowObject = {};

					let date: Date;
					let status = '';
					let value = -1;

					if (client.intake.sent) {
						status = 'Sent form ' + client.intake.sent.form;
						date = client.intake.sent.date;
						value = Math.floor(date.getTime() / 1000);
					} else {
						continue;
					}

					cols.Name = {
						value: client.name,
					};
					cols.Status = {
						value,
						text: `${status} on ${format(date, 'Pp')}`,
					};

					const row: TableRowObject = {
						...cols,
					};

					tableData.push(row);
				}

				return tableData;
			},
		},
		methods: {
			download() {
				const el = document.querySelector('table');
				const wb = xlsx.utils.table_to_book(el);
				const mode = this.filters.mode.replace(/ /g, '');

				const now = new Date();
				const title = `DataAnalyzer-IntakeQ_AuditTrail_${mode}-${
					now.getMonth() + 1
				}/${now.getDate()}.csv`;
				xlsx.writeFile(wb, title);
			},
		},
	});
</script>
