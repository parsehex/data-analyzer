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
						:to="
							col.toLowerCase() + '/' + idFromString(value.text || value.value)
						"
					>
						{{ value.text || value.value }}
					</router-link>
					<span v-else>{{ value.text || value.value }}</span>
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
	import { computed, defineComponent, PropType } from 'vue';
	import { clone, idFromString } from '@/lib/utils';
	import { TableData, TableDataType, ToggleOptions } from '@/types/components';

	export default defineComponent({
		name: 'DataTable',
		props: {
			dark: Boolean,
			small: Boolean,
			bordered: Boolean,
			responsive: Boolean,
			striped: Boolean,
			stickyHeader: Boolean,

			data: {
				type: Array as PropType<TableData>,
				default: [],
			},
			/** Whether to reverse sort order by default */
			defaultReverse: Boolean,
			/** The column to sort on by default */
			defaultSort: {
				type: String,
				default: '',
			},
			linkColumn: {
				type: String,
				default: '',
			},
			// NOTE: the first column will not be hidden
			columnStates: {
				type: Object as PropType<{ [col: string]: boolean }>,
				default: null,
			},
		},
		data(props) {
			return {
				sortKey: props.defaultSort,
				reverse: props.defaultReverse,
				sorted: false,
			};
		},
		computed: {
			anyColumnsHidden(): boolean {
				if (!this.columnStates) return false;
				return Object.values(this.columnStates).includes(false);
			},
			heading(): string[] {
				if (!this.data[0]) {
					return [];
				}
				return Object.keys(this.data[0]).filter(
					(k, i) =>
						// always keep first column
						i === 0 ||
						// keep if columnStates no provided
						!this.columnStates ||
						//  use columnStates val
						this.columnStates[k] ||
						//  keep if columnStates doesn't reference column
						!this.columnStates.hasOwnProperty(k)
				);
			},
			sortedData(): TableData {
				let dataCopy: TableData = clone(this.data);
				if (this.anyColumnsHidden) {
					dataCopy = dataCopy.map((r) => {
						const keys = Object.keys(r);
						for (const k of keys) {
							if (this.columnStates[k] === false) delete r[k];
						}
						return r;
					});
				}
				// @ts-ignore
				return dataCopy.sort((a, b) => {
					const aVal = a[this.sortKey].value;
					const bVal = b[this.sortKey].value;

					if (typeof aVal === 'number' && typeof bVal === 'number') {
						if (this.reverse) return bVal - aVal;
						return aVal - bVal;
					}

					const aStr = (aVal as string).toUpperCase();
					const bStr = (bVal as string).toUpperCase();

					if (this.reverse) {
						if (aStr < bStr) return 1;
						if (aStr > bStr) return -1;
						return 0;
					} else {
						if (aStr < bStr) return -1;
						if (aStr > bStr) return 1;
						return 0;
					}
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
				return typeof this.sortedData[0][column].value === 'number';
			},
			idFromString,
		},
	});
</script>

<style lang="scss">
	table.data-table {
		thead th {
			padding: 0;
			a {
				display: block;
				padding: 8px 16px;

				&:hover {
					background-color: #c7c8c9;
				}
			}
		}
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
