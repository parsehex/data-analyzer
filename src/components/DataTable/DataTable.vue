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
						href="#"
						@click.prevent="sortBy(t)"
						:class="{ active: sortKey == t }"
					>
						{{ t }}
					</a>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row, index) in sortedData" :key="index">
				<td v-for="(value, key) in row" :key="index + key">
					{{ value }}
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts">
	/*
	DataTable
	Pass data as array of objects.
	Each object should have the
	same exact keys, which are used as columns.
*/
	import { computed, defineComponent } from 'vue';
	import { clone } from '../../lib/utils';
	import { TableData } from '../types';

	export default defineComponent({
		name: 'DataTable',
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
					let aVal: string | number = a[this.sortKey];
					let bVal: string | number = b[this.sortKey];

					let aSortVal = aVal as number;
					let bSortVal = bVal as number;

					if (typeof aVal === 'string' && typeof bVal === 'string') {
						// try to parse number-containing strings
						if (/^\$/.test(aVal)) {
							// value is dollar-formatted
							aSortVal = +aVal.substr(1);
							bSortVal = +bVal.substr(1);
						} else if (/\d+/.test(aVal)) {
							// has numbers
							aSortVal = +aVal;
							bSortVal = +bVal;
						} else {
							// sort text
							let aStr = aVal.toUpperCase();
							let bStr = bVal.toUpperCase();

							if (this.reverse) {
								if (aStr < bStr) return 1;
								if (aStr > bStr) return -1;
								return 0;
							} else {
								if (aStr < bStr) return -1;
								if (aStr > bStr) return 1;
								return 0;
							}
						}
					}

					if (this.reverse) return bSortVal - aSortVal;
					return aSortVal - bSortVal;
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
