<template>
	<table
		ref="tableEl"
		:class="{
			'data-table': true,
			table: true,
			'table-hover': true,
			'table-dark': dark,
			'table-sm': small,
			'table-bordered': bordered,
			'table-responsive': responsive,
			'table-striped': striped,
			'sticky-header': stickyHeader,
		}"
	>
		<thead :class="dark ? 'thead-dark' : 'thead-light'">
			<tr>
				<th v-for="t in heading" :key="idFromString(t)" scope="col">
					<a
						href="#"
						@click.prevent="sortBy(t)"
						:class="{ active: sortKey == t }"
					>
						{{ t }}
						<icon
							v-if="sortKey === t"
							:size="16"
							:type="'arrow-' + (reverse ? 'down' : 'up')"
						/>
					</a>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row, index) in sortedData" :key="index">
				<td v-for="(value, col) in row" :key="index + col">
					<router-link
						v-if="linkColumn === col"
						:to="col.toLowerCase() + '/' + idFromString(value)"
					>
						{{ value }}
					</router-link>
					<span v-else>{{ value }}</span>
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
	import { clone, idFromString } from '../../lib/utils';
	import { TableData, TableDataType } from '../types';

	export default defineComponent({
		name: 'DataTable',
		props: {
			data: {
				type: Array as () => TableData,
				default: [],
			},
			dark: Boolean,
			small: Boolean,
			bordered: Boolean,
			responsive: Boolean,
			striped: Boolean,
			stickyHeader: Boolean,
			defaultSort: {
				type: String,
				default: '',
			},
			linkColumn: {
				type: String,
				default: '',
			},
		},
		data(props) {
			return {
				sortKey: props.defaultSort,
				reverse: true,
				sorted: false,
			};
		},
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
				const dataCopy: TableData = clone(this.data);
				// @ts-ignore
				return dataCopy.sort((a, b) => {
					let aVal: TableDataType = a[this.sortKey];
					let bVal: TableDataType = b[this.sortKey];

					let aSortVal = aVal as number;
					let bSortVal = bVal as number;

					if (typeof aVal === 'string' && typeof bVal === 'string') {
						// parse number-containing strings
						if (/^\$/.test(aVal)) {
							// value is dollar-formatted
							aSortVal = +aVal.replace(/,/g, '').substr(1);
							bSortVal = +bVal.replace(/,/g, '').substr(1);
						} else if (/\d+/.test(aVal)) {
							// has numbers
							aSortVal = +aVal.replace(/,/g, '');
							bSortVal = +bVal.replace(/,/g, '');
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
				this.reverse = this.isNumber(column);
			},
			isNumber(column: string) {
				return /\d+/.test(this.sortedData[0][column]);
			},
			idFromString,
		},
	});
</script>

<style lang="scss">
	table.data-table {
		thead th {
			a {
				display: block;
			}
		}
		th,
		td {
			padding: 8px 16px;
		}

		&.sticky-header {
			overflow-y: auto;
			border-collapse: collapse;
			width: 100%;

			thead th {
				position: sticky;
				top: 0;
			}
		}
	}
</style>
