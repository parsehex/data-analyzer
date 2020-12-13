<template>
	<div>
		<data-table
			:data="data"
			default-sort="Date"
			:default-reverse="true"
			small
			bordered
			sticky-header
		/>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, PropType, watch } from 'vue';
	import { TableData } from '@/types/components';
	import { PNCStatementActivityColumn } from '@/types/file-data/pnc';
	import { getTableData } from './data/table';

	export default defineComponent({
		name: 'PNCStatementActivity',
		props: {
			fileData: {
				type: Object as PropType<PNCStatementActivityColumn[]>,
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
