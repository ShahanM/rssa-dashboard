import { atom } from 'recoil';
import type { Study } from '../utils/generics.types';

export const studyState = atom<Study | null>({
	key: 'studyState',
	default: null
});