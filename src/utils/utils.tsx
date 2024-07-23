import { OrderedComponent, Study } from './generics.types';

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

export function formatDateString(datestr: string) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	}).format(new Date(datestr));
}


export function isStudy(component: any): component is Study {
	const study = component as Study;
	return (study.id !== undefined && typeof study.id === 'string') &&
		(study.name !== undefined && typeof study.name === 'string') &&
		(study.description !== undefined && typeof study.description === 'string') &&
		(study.date_created !== undefined && typeof study.date_created === 'string');
}