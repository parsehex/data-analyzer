<template>
	<div>
		<div class="form-inline my-2">
			<form-group class="px-2">
				<label for="mode">View results by</label>
				<select class="form-control mx-2" id="mode" v-model="mode">
					<option value="Appointment Type">Appointment Type</option>
					<option value="Billing Method">Billing Method</option>
					<option value="Clinician Name">Clinician</option>
					<option value="Patient Name">Patient Name</option>
					<option value="Primary Insurer Name">Primary Insurer</option>
					<option value="Secondary Insurer Name">Secondary Insurer</option>
					<option value="Service Description">Service Type</option>
				</select>
			</form-group>
			<form-group>
				<toggle-dropdown
					label="Show/Hide Columns"
					label-type="info"
					v-model="columns"
				/>
			</form-group>
		</div>
		<data-table
			:data="data"
			:column-states="columns"
			default-sort="Total Sessions"
			:default-reverse="true"
			small
			sticky-header
		/>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, watch } from 'vue';
	import * as xlsx from 'xlsx';
	import { DBFileObject, getFileData } from '../../lib/db';
	import tippy from 'tippy.js';
	import { TableData } from '../../components/types';
	import { clone } from '../../lib/utils';
	import { DBFileDataObject } from '../../lib/db';
	import { TherapyNotesColumn } from '../../data-types';
	import numeral from 'numeral';
	import math from '../../mathjs';
	import state from '../../lib/state';
	import { loadSettings, saveSettings } from '../../lib/settings';

	const DataID = 'therapy-notes';
	const DataVersion = 2;

	export default defineComponent({
		name: 'TherapyNotesSpreadsheet',
		props: {
			fileData: {
				type: Object as () => DBFileDataObject,
				required: true,
			},
		},
		data() {
			const DefaultData = {
				mode: 'Clinician Name' as keyof TherapyNotesColumn,
				isDev: state.isDev,
				columns: {
					Average: true,
					'Total Earnings': true,
					'Total Sessions': true,
				},
			};

			const loadedData = loadSettings(DataID, DefaultData, DataVersion);
			loadedData.isDev = state.isDev;

			return loadedData;
		},
		setup(props) {
			return {};
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
			data() {
				if (!this.fileData) return [];

				const tableData: TableData = [];

				const clinicians: {
					name: string;
					sessionTotals: number[];
				}[] = [];
				for (const row of this.fileData as TherapyNotesColumn[]) {
					if (row.Type !== 'Appointment') continue;

					const pPaid = math.abs(row['Patient Amount Paid'] || 0);
					const iPaid = math.abs(row['Insurance Amount Paid'] || 0);

					let name = row[this.mode];
					if (!name) {
						if (this.mode === 'Primary Insurer Name') name = 'No Insurance';
						if (this.mode === 'Secondary Insurer Name') name = 'N/A';
						if (this.mode === 'Patient Name')
							name = row['First Name'] + ' ' + row['Last Name'];
					}

					let doc = clinicians.find((d) => d.name === name);
					if (!doc) {
						doc = {
							name,
							sessionTotals: [],
						};
						clinicians.push(doc);
					}

					const total = math.add(pPaid, iPaid);

					let value = total.valueOf() as number;
					doc.sessionTotals.push(value);
				}

				for (const doc of clinicians) {
					const average = math.mean(...doc.sessionTotals);
					const median = math.median(...doc.sessionTotals);
					const sum = math.sum(...doc.sessionTotals);
					const sessions = doc.sessionTotals.length;

					tableData.push({
						[this.mode]: doc.name,
						Average: `$${numeral(average).format('0,0.00')}`,
						Median: `$${numeral(median).format('0,0.00')}`,
						'Total Earnings': `$${numeral(sum).format('0,0.00')}`,
						'Total Sessions': `${numeral(sessions).format('0,0')}`,
					});
				}

				return tableData;
			},
		},
	});
</script>
