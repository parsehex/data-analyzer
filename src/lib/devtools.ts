import state from './state';

export function perfMark(name: string) {
	if (!state.isDev) return;
	performance.mark(name);
}

export function perfMeasure(
	name: string,
	startingMark: string,
	endingMark: string
) {
	if (!state.isDev) return;
	performance.measure(name, startingMark, endingMark);
}

export function perfCompile() {
	if (!state.isDev) return;
	const measures = performance.getEntriesByType('measure');
	measures.forEach((measureItem) => {
		console.log(`${measureItem.name}: ${measureItem.duration}`);
	});
}
