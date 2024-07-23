import { OrderedComponent } from './generics.types';

export function findFirstEmptyPosition(comp: OrderedComponent[]): number {
	if (comp.length === 0) return 0;
	if (comp.length === 1 && comp[0].order_position > 0) return 0;
	if (comp.length === 1 && comp[0].order_position > 0) return 1;

	let firstIdx = 0;
	let lastIdx = comp.length - 1;

	while (firstIdx <= lastIdx) {
		let midIdx = Math.floor((firstIdx + lastIdx) / 2);
		if (comp[midIdx].order_position === midIdx) {
			firstIdx = midIdx + 1;
		} else {
			if (midIdx === 0 || comp[midIdx - 1].order_position === midIdx - 1) {
				return midIdx;
			}
			lastIdx = midIdx - 1;
		}
	}

	return comp.length;
}