<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<label class="input-group-text"><slot /></label>
		</div>
		<select
			class="custom-select custom-select-"
			v-model="month"
			style="width: auto"
		>
			<option v-for="(m, i) in months" :value="i">
				{{ m }}
			</option>
		</select>
		<select
			class="custom-select custom-select-"
			v-model="day"
			style="width: auto"
		>
			<option v-for="d in daysInMonth(month, year)" :value="d">
				{{ d }}
			</option>
		</select>
		<select
			class="custom-select custom-select-"
			v-model="year"
			style="width: auto"
		>
			<option v-for="y in years" :value="y">
				{{ y }}
			</option>
		</select>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, PropType, watch } from 'vue';
	import { DateObject } from '@/types/components';
	import { daysInMonth, months } from '@/const';

	export default defineComponent({
		name: 'DateSelector',
		emits: ['update:modelValue'],
		props: {
			modelValue: {
				type: Object as PropType<DateObject>,
				required: true,
			},
		},
		data(props) {
			return {
				month: props.modelValue.month,
				day: props.modelValue.day,
				year: props.modelValue.year,
			};
		},
		computed: {
			months: () => months,
			years: () => {
				const y: number[] = [];
				const thisYear = new Date().getFullYear();
				for (let i = 2010; i <= thisYear; i++) {
					y.push(i);
				}
				return y;
			},
		},
		methods: {
			daysInMonth,
		},
		mounted() {
			watch(
				[this.$data],
				(data) => {
					const newData = {
						day: this.day,
						month: this.month,
						year: this.year,
					};
					this.$emit('update:modelValue', newData);
				},
				{ deep: true }
			);
		},
	});
</script>
