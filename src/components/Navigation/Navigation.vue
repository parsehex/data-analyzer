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
				<li class="nav-item">
					<btn
						type="warning"
						outline
						size="xs"
						@click="reset"
						title="Reset all data for Data Analyzer"
					>
						Reset Data
					</btn>
				</li>
				<li class="nav-item" v-if="isDev">
					<btn type="info" outline @click="logTimings">Log Timings</btn>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import Dexie from 'dexie';
	import state from '@/lib/state';
	import { perfCompile } from '@/lib/devtools';
	import NavItem from './NavItem.vue';

	export default defineComponent({
		components: { NavItem },
		name: 'Navigation',
		data: () => ({ isDev: state.isDev, timing: state.timingEnabled }),
		props: {
			title: {
				type: String,
				required: true,
			},
		},
		methods: {
			reset: async () => {
				await Dexie.delete('data-analyzer');
				localStorage.clear();
				window.location.replace('/');
			},
			logTimings: perfCompile,
		},
	});
</script>
