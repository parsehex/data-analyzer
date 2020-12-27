<template>
	<div>
		<div class="form-inline my-2">
			<form-group class="px-1">
				<label for="mode">Results Mode:</label>
				<select class="form-control mx-1" id="mode" v-model="mode">
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
					label="Show/Hide Columns"
					label-type="info"
					v-model="columns"
				/>
			</form-group>
			<form-group class="px-1">
				<date-selector v-model="dateFrom" label="From" />
			</form-group>
			<form-group class="px-1">
				<date-selector v-model="dateTo" label="To" />
			</form-group>
		</div>
		<data-table
			:data="data"
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
	import { getDaysInMonth, isAfter, isBefore, set } from 'date-fns';
	import { getFile } from '@/lib/db';
	import { clone, newDateFromExcel } from '@/lib/utils';
	import state from '@/lib/state';
	import { loadSettings, saveSettings } from '@/lib/settings';
	import { DateObject, TableData } from '@/types/components';
	import { TherapyNotesColumn } from '@/types/file-data/therapy-notes';

	import { DataMode, getTableData } from './data/table';

	const DataID = 'therapy-notes';
	const DataVersion = 3;

	export default defineComponent({
		name: 'TherapyNotesSpreadsheet',
		props: {
			fileData: {
				type: Object as PropType<TherapyNotesColumn[]>,
				required: true,
			},
		},
		data() {
			const now = new Date();
			const DefaultData = {
				mode: 'Clinician Name' as DataMode,
				isDev: state.isDev,
				dateFrom: {
					day: now.getDate(),
					month: now.getMonth(),
					year: now.getFullYear(),
				} as DateObject,
				dateTo: {
					day: now.getDate(),
					month: now.getMonth(),
					year: now.getFullYear(),
				} as DateObject,
				columns: {
					Average: true,
					Q1: true,
					Median: true,
					Q3: true,
					IQR: true,
					'Total Earnings': true,
					'Total Sessions': true,
				},
			};

			const loadedData = loadSettings(DataID, DefaultData, DataVersion);
			loadedData.isDev = state.isDev;

			return loadedData;
		},
		computed: {
			data(): TableData {
				const from = set(new Date(), this.dateFrom);
				const to = set(new Date(), this.dateTo);

				const filteredData = this.fileData.filter((row) => {
					if (isAfter(newDateFromExcel(row.Date), to)) return false;
					if (isBefore(newDateFromExcel(row.Date), from)) return false;
					return true;
				});
				return getTableData(filteredData, this.mode);
			},
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
	});
</script>
