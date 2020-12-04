export default {
	alias: {
		vue: 'vue/dist/vue.esm-bundler.js',
		math: 'mathjs/dist/math.min.js',
	},
	optimizeDeps: {
		include: ['mathjs/dist/math.min.js'],
	},
};
