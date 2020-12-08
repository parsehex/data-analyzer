<template>
	<div class="dropdown">
		<btn
			class="dropdown-toggle"
			:type="labelType"
			id="dropdownMenuButton"
			data-toggle="dropdown"
			aria-haspopup="true"
			aria-expanded="false"
		>
			{{ label }}
		</btn>
		<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
			<a
				v-for="(val, opt) in modelValue"
				:key="opt"
				:class="['dropdown-item', val ? 'active' : '']"
				href="#"
				@click.prevent.stop="select(opt)"
			>
				{{ opt }}
			</a>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import { BootstrapType, ToggleOptions } from '@/types/components';

	export default defineComponent({
		name: 'ToggleDropdown',
		emits: ['update:modelValue'],
		props: {
			label: {
				type: String,
				required: true,
			},
			labelType: {
				type: String as () => BootstrapType,
				default: 'secondary',
			},
			modelValue: {
				type: Object as () => ToggleOptions,
				required: true,
			},
		},
		methods: {
			select(key: string) {
				const newVal = !this.modelValue[key];
				const newData = Object.assign({}, this.modelValue, { [key]: newVal });
				this.$emit('update:modelValue', newData);
			},
		},
		setup(props) {
			return {};
		},
	});
</script>
