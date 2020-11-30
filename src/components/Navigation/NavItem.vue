<template>
	<router-link :to="to" custom v-slot="{ href, isActive }">
		<li :class="['nav-item', isActive ? 'active' : '']">
			<a :class="['nav-link', disabled ? 'disabled' : '']" :href="href">
				<slot />
			</a>
			<span v-if="isActive" class="sr-only">(current)</span>
		</li>
	</router-link>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';

	export default defineComponent({
		name: 'NavItem',
		props: {
			to: {
				type: String,
				required: true,
			},
			disabled: {
				type: Boolean,
				required: false,
				default: false,
			},
		},
		setup(props) {
			return {};
		},
	});
</script>
