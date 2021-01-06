<template>
	<div>
		<div class="form-inline d-print-none my-2">
			<form-group class="px-2">
				<label for="mode">Results Mode:</label>
				<select class="form-control mx-2" id="mode" v-model="filters.mode">
					<option value="Appointment Type">Appointment Type</option>
					<option value="Billing Method">Billing Method</option>
					<option value="Clinician Name">Clinician</option>
					<option value="Month">Month</option>
					<option value="Patient Name">Patient</option>
					<option value="Primary Insurer Name">Primary Insurer</option>
					<option value="Secondary Insurer Name">Secondary Insurer</option>
					<option value="Service Description">Service Type</option>
				</select>
			</form-group>
			<form-group class="px-2">
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
			:column-states="columns"
			default-sort="Total Sessions"
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
	import { TherapyNotesRow } from '@/types/file-data/therapy-notes';
	import math from '@/math';
	import { DataMode, nextApptCol, owesCols } from './data/table';
	import { getPrimaryColumnValue } from './data/table/primary-column';
	import { Appointment, parseAppointments } from './data';
	import { filterAppointments } from './data/filter';
	import { basicStatCols, rpsCols } from './data/table';

	const DataID = 'therapy-notes';
	const DataVersion = 3;

	interface TableResult {
		cell: TableDataObject;
		name: string;
		value?: number;
		appointments: Appointment[];
	}

	export default defineComponent({
		name: 'TherapyNotesSpreadsheet',
		props: {
			fileData: {
				type: Object as PropType<TherapyNotesRow[]>,
				required: true,
			},
		},
		data() {
			const DefaultData = {
				isDev: state.isDev,
				filters: {
					mode: 'Clinician Name' as DataMode,
				},
				columns: {
					Average: true,
					Q1: true,
					Median: true,
					Q3: true,
					IQR: true,
					'Patient Owes': true,
					'Insurance Owes': true,
					'Total Earnings': true,
					'Total Sessions': true,
					'Next Appointment': true,
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
			results() {
				const results: TableResult[] = [];
				for (const appt of this.appts) {
					const primaryCol = getPrimaryColumnValue(appt, this.filters.mode);
					const name = primaryCol.text || primaryCol.value;

					let result = results.find((v) => v.name === name);

					if (!result) {
						result = {
							cell: primaryCol,
							name: name as string,
							appointments: [],
						};
						if (primaryCol.text) result.value = primaryCol.value as number;
						results.push(result);
					}

					result.appointments.push(appt);
				}
				return results;
			},
			tableData(): TableData {
				const { results } = this;
				const tableData: TableData = [];

				const { mode } = this.filters;
				for (const result of results) {
					const cols: TableRowObject = {};

					if (
						[
							'Clinician Name',
							'Month',
							'Patient Name',
							'Primary Insurer Name',
							'Secondary Insurer Name',
						].includes(mode)
					) {
						Object.assign(cols, rpsCols(result.appointments));
					}

					if (['Patient Name'].includes(mode)) {
						Object.assign(cols, owesCols(result.appointments));
						Object.assign(cols, nextApptCol(result.appointments));
					}

					const row: TableRowObject = {
						[mode]: {
							value: result.name,
						},
						...cols,
					};
					if (typeof result.value === 'number') {
						row[mode].value = result.value;
						row[mode].text = result.name;
					}

					tableData.push(row);
				}

				return tableData;
			},

			/** Filtered list of appointments */
			appts() {
				let appts = parseAppointments(this.fileData);
				appts = filterAppointments(appts, this.filters);
				return appts;
			},
		},
		methods: {
			download() {
				const el = document.querySelector('table');
				const wb = xlsx.utils.table_to_book(el);

				const now = new Date();
				const title = `TherapyNotes_Spreadsheet-${
					now.getMonth() + 1
				}/${now.getDate()}.csv`;
				xlsx.writeFile(wb, title);
			},
		},
	});
</script>
