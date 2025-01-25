import type { UserConfig } from 'vite';
import tsResolver from 'vite-tsconfig-paths';

const isDev = process.env.NODE_ENV === 'development';

const config: UserConfig = {
	alias: {
		vue: 'vue/dist/vue.esm-bundler.js',
		math: 'mathjs/dist/math.min.js',
	},
	optimizeDeps: {
		include: ['mathjs/dist/math.min.js'],
	},
	resolvers: [tsResolver],
	base: isDev ? '/' : '/data-analyzer',
};
export default config;
