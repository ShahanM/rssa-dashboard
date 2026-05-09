import { studyConfig } from './study.config';
import { surveyConfig } from './survey.config';
import { systemConfig } from './system.config';
import type { DashboardResourceConfig } from '../../types/resourceClient.types';
import { participantDataConfig } from './participantDataConfig';

export const resourceConfig: DashboardResourceConfig = {
    ...studyConfig,
    ...surveyConfig,
    ...systemConfig,
    ...participantDataConfig,
};
