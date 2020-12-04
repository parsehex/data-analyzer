<template>
	<div>
		<div class="form-inline my-2">
			<div class="form-group px-2">
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
			</div>
			<div class="form-group" v-if="isDev">
				<div class="dropdown">
					<button
						class="btn btn-secondary dropdown-toggle"
						type="button"
						id="dropdownMenuButton"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false"
					>
						Enable/Disable Columns
					</button>
					<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a class="dropdown-item" href="#">Action</a>
						<a class="dropdown-item" href="#">Another action</a>
						<a class="dropdown-item" href="#">Something else here</a>
					</div>
				</div>
			</div>
			<div v-if="isDev" class="form-group px-2">
				<label
					class="form-check-label"
					for="precise"
					title="More precise calculations are slower but more accurate"
				>
					Precise numbers
				</label>
				<input
					id="precise"
					class="form-check-input mx-1"
					type="checkbox"
					v-model="precise"
					title="More precise calculations are slower but more accurate"
				/>
			</div>
		</div>
		<data-table
			:data="data"
			default-sort="Total Earnings"
			small
			sticky-header
		/>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
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

	export default defineComponent({
		name: 'TherapyNotesSpreadsheet',
		props: {
			fileData: {
				type: Object as () => DBFileDataObject,
				required: true,
			},
		},
		data: () => ({
			mode: 'Clinician Name' as keyof TherapyNotesColumn,
			isDev: state.isDev,
			precise: !state.isDev,
		}),
		setup(props) {
			return {};
		},
		computed: {
			data() {
				if (!this.fileData) return [];

				const tableData: TableData = [];

				const clinicians: {
					name: string;
					sessionTotals: (math.BigNumber | number)[];
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

					let value: math.BigNumber | number = total.valueOf() as number;
					if (this.precise) value = math.bignumber(value);
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
