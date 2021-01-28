<template>
	<div :class="className">
		<div class="card-header" v-if="$slots.header">
			<slot name="header" />
		</div>
		<div class="card-body" v-if="$slots.title || $slots.text">
			<h5 class="card-title" v-if="$slots.title">
				<slot name="title" />
			</h5>
			<p class="card-text" v-if="$slots.text">
				<slot name="text" />
			</p>
		</div>
		<div class="card-body" v-if="actions?.length > 0">
			<a
				href="#"
				class="card-link"
				v-for="a in actions"
				:key="a"
				@click="a.callback"
			>
				{{ a.label }}
			</a>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, PropType } from 'vue';
	import { BootstrapType } from '@/types/components';

	interface ActionButton {
		label: string;
		callback: () => void;
	}

	export default defineComponent({
		name: 'Card',
		props: {
			type: {
				type: String as PropType<BootstrapType>,
				required: true,
			},
			size: {
				type: String as PropType<'' | 'xs' | 'sm' | 'lg'>,
				required: false,
				default: '',
			},
			actions: {
				type: Object as PropType<ActionButton[]>,
				required: false,
				default: [],
			},
		},
		computed: {
			className() {
				const { size, type } = this;
				let className = 'card';

				className += ` bg-${type}`;

				if (type !== 'light') {
					className += ' text-white';
				}

				if (size) className += ' btn-' + size;

				return className;
			},
		},
	});
</script>

<style lang="scss">
	div.card {
		div.card-body {
			padding: 0.65rem 1.25rem;
		}
	}
</style>
