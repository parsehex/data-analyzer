<template>
	<div class="progress">
		<div
			:class="[
				'progress-bar',
				striped ? 'progress-bar-striped' : '',
				animated ? 'progress-bar-animated' : '',
				'bg-' + type,
			]"
			role="progressbar"
			:style="{ width: value + '%' }"
			:aria-valuenow="value"
			aria-valuemin="0"
			aria-valuemax="100"
		>
			{{ label || '' }}
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { BootstrapType } from './types';

export default defineComponent({
	name: 'progress-bar',
	props: {
		type: {
			type: String as () => BootstrapType,
			required: true,
		},
		striped: Boolean,
		animated: Boolean,
		label: String,
		value: {
			type: Number,
			required: true,
		},
	},
	setup(props) {
		return {};
	},
});
</script>
