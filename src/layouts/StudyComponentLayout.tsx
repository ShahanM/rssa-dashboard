import React from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const StudyNavigationLayout: React.FC = () => {
    const { stepId, pageId, conditionId } = useParams<{ studyId: string; stepId: string; pageId: string; conditionId: string }>();
    const location = useLocation();
    const { study, step, page, condition } = useAppSelector((state) => state.studyComponentSelection);

    const pathSegments = location.pathname.split('/').filter((s) => s !== '');
    const rootResource = pathSegments[0];
    const rootId = pathSegments[1];

    // Determine the segments that come after the root resource and ID
    // If rootId is present, we start after it. If not, we start after rootResource.
    let relativePathSegments: string[] = [];
    if (rootId) {
        const rootIndex = pathSegments.indexOf(rootId);
        if (rootIndex !== -1) {
            relativePathSegments = pathSegments.slice(rootIndex + 1);
        }
    } else if (rootResource) {
        const rootIndex = pathSegments.indexOf(rootResource);
        if (rootIndex !== -1) {
            relativePathSegments = pathSegments.slice(rootIndex + 1);
        }
    }

    const isStudyRoot = relativePathSegments.length === 0;
    const breadcrumbItems = [];

    let rootLabel = 'Studies';
    if (rootResource === 'survey-constructs') {
        rootLabel = 'Survey Instruments';
    } else if (rootResource === 'survey-scales') {
        rootLabel = 'Scale Library';
    }

    breadcrumbItems.push(
        <span key="dashboard-root">
            <Link to={`/${rootResource}`} className="text-purple-600 hover:underline">
                {rootLabel}
            </Link>
            <span className="mx-2 text-gray-500">&gt;</span>
        </span>
    );

    if (study) {
        breadcrumbItems.push(
            isStudyRoot ? (
                <span key="study-current" className="font-semibold text-gray-700">
                    {study.display_name}
                </span>
            ) : (
                <Link key="study-link" to={`/${rootResource}/${rootId}`} className="text-purple-600 hover:underline">
                    {study.display_name}
                </Link>
            )
        );
    } else if (rootId) {
        breadcrumbItems.push(
            <Link key="study-link" to={`/${rootResource}/${rootId}`} className="text-purple-600 hover:underline">
                <span key="study-loading" className="text-gray-500">
                    {rootId.substring(0, 8)}
                </span>
            </Link>
        );
    }

    let currentPathAccumulator = `/${rootResource}/${rootId}`;
    relativePathSegments.forEach((segment, index) => {
        currentPathAccumulator += `/${segment}`;
        const isLast = index === relativePathSegments.length - 1;

        if (segment === 'steps' || segment === 'pages' || segment === 'conditions') return;

        let displayName = segment.substring(0, 8); // Default to truncated ID

        if (segment === stepId && step) {
            displayName = step.display_name;
        } else if (segment === pageId && page) {
            displayName = page.display_name;
        } else if (segment === conditionId && condition) {
            displayName = condition.display_name;
        }

        breadcrumbItems.push(
            <React.Fragment key={currentPathAccumulator}>
                <span className="mx-2 text-gray-500">&gt;</span>
                {isLast ? (
                    <span className="font-semibold text-gray-700">{displayName}</span>
                ) : (
                    <Link to={currentPathAccumulator} className="text-purple-600 hover:underline">
                        {displayName}
                    </Link>
                )}
            </React.Fragment>
        );
    });

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg">
            <div className="border border-gray-200 rounded p-3 bg-white shadow-sm mb-4">
                <div aria-label="breadcrumb">
                    {breadcrumbItems}
                </div>
            </div>
            <Outlet />
        </div>
    );
};

const StudyComponentLayout: React.FC = () => {
    return <StudyNavigationLayout />;
};

export default StudyComponentLayout;
