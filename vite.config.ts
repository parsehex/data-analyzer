import type { UserConfig } from 'vite';
import tsResolver from 'vite-tsconfig-paths';

const config: UserConfig = {
	alias: {
		vue: 'vue/dist/vue.esm-bundler.js',
		math: 'mathjs/dist/math.min.js',
	},
	optimizeDeps: {
		include: ['mathjs/dist/math.min.js'],
	},
	resolvers: [tsResolver],
};
export default config;
