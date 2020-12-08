<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<router-link class="navbar-brand" to="/">
			<img src="/logo.png" width="30" height="30" alt="" loading="lazy" />
		</router-link>
		<router-link to="/" class="navbar-brand">{{ title }}</router-link>
		<button
			class="navbar-toggler"
			type="button"
			data-toggle="collapse"
			data-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav mr-auto">
				<nav-item to="/">Home</nav-item>
				<nav-item to="/upload">Add New Data</nav-item>
				<btn type="secondary" v-if="isDev" @click="reset">Reset DB</btn>
			</ul>
		</div>
	</nav>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import state from '@/lib/state';
	import NavItem from './NavItem.vue';
	import Dexie from 'dexie';

	export default defineComponent({
		components: { NavItem },
		name: 'Navigation',
		props: {
			title: {
				type: String,
				required: true,
			},
		},
		computed: {
			isDev: () => state.isDev,
		},
		methods: {
			reset: async () => {
				await Dexie.delete('data-analyzer');
				window.location.reload();
			},
		},
	});
</script>
