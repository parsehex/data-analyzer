<template>
	<div>
		<data-table
			:data="data"
			default-sort="Date"
			:default-reverse="true"
			small
			sticky-header
		/>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, PropType, watch } from 'vue';
	import { TableData } from '@/types/components';
	import { PNCStatementColumn } from '@/types/file-data/pnc';
	import { getTableData } from './data/table';

	export default defineComponent({
		name: 'PNCStatement',
		props: {
			fileData: {
				type: Object as PropType<PNCStatementColumn[]>,
				required: true,
			},
		},
		computed: {
			data(): TableData {
				return getTableData(this.fileData);
			},
		},
	});
</script>
