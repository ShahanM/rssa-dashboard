import { OrderedComponent, Study, Page } from './generics.types';

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

export function orderPosition<T extends OrderedComponent>(comp: T[]): T[] {
	return comp.sort((a, b) => a.order_position < b.order_position ? -1
		: a.order_position > b.order_position ? 1 : 0);
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

export function isPage(component: any): component is Page {
	const page = component as Page;
	return (page.id !== undefined && typeof page.id === 'string') &&
		(page.study_id !== undefined && typeof page.study_id === 'string') &&
		(page.step_id !== undefined && typeof page.step_id === 'string') &&
		(page.name !== undefined && typeof page.name === 'string') &&
		(page.description !== undefined && typeof page.description === 'string') &&
		(page.date_created !== undefined && typeof page.date_created === 'string');
}