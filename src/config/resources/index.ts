import { studyConfig } from './study.config';
import { surveyConfig } from './survey.config';
import { systemConfig } from './system.config';
import type { DashboardResourceConfig } from '../../types/resourceClient.types';

export const resourceConfig: DashboardResourceConfig = {
    ...studyConfig,
    ...surveyConfig,
    ...systemConfig,
};
