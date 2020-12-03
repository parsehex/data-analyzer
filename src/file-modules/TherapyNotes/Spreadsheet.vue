<template>
	<data-table
		:data="data"
		link-column="Clinician"
		default-sort="Total Sessions"
		small
	/>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
	import * as xlsx from 'xlsx';
	import { DBFileObject, getFileData } from '../../lib/db';
	import tippy from 'tippy.js';
	import { TableData } from '../../components/types';
	import { arrayAverage } from '../../lib/utils';
	import { DBFileDataObject } from '../../lib/db';

	export default defineComponent({
		name: 'TherapyNotesSpreadsheet',
		props: {
			fileData: {
				type: Object as () => DBFileDataObject,
				required: true,
			},
		},
		data: () => ({
			viewing: '',
		}),
		setup(props) {
			return {};
		},
		computed: {
			data() {
				if (!this.fileData) return [];

				const tableData: TableData = [];

				const clinicians: { name: string; sessionTotals: number[] }[] = [];
				for (const row of this.fileData) {
					if (!row['Clinician Name']) continue;
					let doc = clinicians.find((d) => d.name === row['Clinician Name']);
					if (!doc) {
						doc = {
							name: row['Clinician Name'],
							sessionTotals: [],
						};
						clinicians.push(doc);
					}

					const total =
						Math.abs(row['Patient Amount Paid'] || 0) +
						Math.abs(row['Insurance Amount Paid'] || 0);
					doc.sessionTotals.push(total);
				}

				for (const doc of clinicians) {
					const average = arrayAverage(doc.sessionTotals);

					tableData.push({
						Clinician: doc.name,
						'Average Earnings Per Session': `$${average.toFixed(2)}`,
						'Total Sessions': doc.sessionTotals.length,
					});
				}

				return tableData;
			},
		},
	});
</script>
