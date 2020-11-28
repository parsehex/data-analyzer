<template>
	<table
		ref="tableEl"
		:class="[
			'table',
			'table-hover',
			dark ? 'table-dark' : '',
			small ? 'table-sm' : '',
		]"
	>
		<thead>
			<tr>
				<th v-for="t in heading" :key="t" scope="col">
					<a
						v-if="isNumber(t)"
						href="#"
						@click.prevent="sortBy(t)"
						:class="{ active: sortKey == t }"
					>
						{{ t }}
					</a>
					<span v-else>{{ t }}</span>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row, index) in sortedData" :key="row['Clinician']">
				<td v-for="(value, key) in row" :key="row['Clinician'] + key">
					{{ value }}
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { clone } from '../../lib/utils';
import { TableData } from '../types';

export default defineComponent({
	name: 'data-table',
	props: {
		data: {
			type: Array as () => TableData,
			default: [],
		},
		dark: Boolean,
		small: Boolean,
	},
	data: () => ({
		sortKey: '',
		reverse: true,
		sorted: false,
	}),
	setup(props) {
		const heading = computed(() => {
			if (!props.data[0]) {
				return [];
			}
			return Object.keys(props.data[0]);
		});

		return { heading };
	},
	computed: {
		sortedData() {
			const dataCopy = clone(this.data);
			// @ts-ignore
			return dataCopy.sort((a, b) => {
				if (!this.sortKey) this.sortKey = 'Total Sessions';
				let aVal = a[this.sortKey];
				let bVal = b[this.sortKey];

				if (this.sortKey?.includes('Average')) {
					aVal = +aVal.substr(1);
					bVal = +bVal.substr(1);
				}

				if (this.reverse) return bVal - aVal;
				return aVal - bVal;
			});
		},
	},
	methods: {
		sortBy(column: string) {
			if (this.sortKey === column) {
				this.reverse = !this.reverse;
				return;
			}
			this.sortKey = column;
			this.reverse = false;
		},
		isNumber(column: string) {
			return /\d+/.test(this.sortedData[0][column]);
		},
	},
});
</script>
