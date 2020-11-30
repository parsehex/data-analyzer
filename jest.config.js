// import type { Config } from '@jest/types';

// export default {
// 	moduleFileExtensions: [
// 		'js',
// 		'ts',
// 		'json',
// 		// tell Jest to handle `*.vue` files
// 		'vue',
// 	],
// 	transform: {
// 		// process `*.vue` files with `vue-jest`
// 		'.*\\.(vue)$': 'vue-jest',
// 		'^.+\\.ts$': 'ts-jest',
// 	},
// 	testURL: 'http://localhost:8080/',
// 	testRegex: '(/src/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
// };

module.exports = {
	preset: 'ts-jest',
	globals: {},
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.vue$': 'vue-jest',
		'^.+\\ts$': 'babel-jest',
	},
	moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
	globals: {
		'ts-jest': {
			babelConfig: true,
		},
	},
};
