import { generateID } from './utils';

describe('ID generator', () => {
	test('generates a string', () => {
		expect(generateID()).toMatch(/[\w\d]{9,}/);
	});
	test('generates a different result each time', () => {
		const first = generateID();
		const second = generateID();
		expect(first).not.toEqual(second);
	});
});
