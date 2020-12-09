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
	import { DBFileObject, getFileData, DBFileDataObject } from '../../lib/db';
	import { clone } from '../../lib/utils';
	import state from '../../lib/state';
	import { loadSettings, saveSettings } from '../../lib/settings';
	import { DataMode, getTableData } from './data';

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
				mode: 'Clinician Name' as DataMode,
				isDev: state.isDev,
				columns: {
					Average: true,
					Q1: false,
					Median: true,
					Q3: false,
					IQR: false,
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
				return getTableData(this.fileData, this.mode);
			},
		},
	});
</script>
