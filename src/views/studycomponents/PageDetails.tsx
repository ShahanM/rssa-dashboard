import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/resources/ResourceChildList';
import ResourceInfoPanel from '../../components/resources/ResourceInfoPanel';
import { clearSelectedPage, setPage } from '../../store/studycomponents/selectionSlice';
import type { Page, PageContent } from '../../types/studyComponents.types';

const PageDetails: React.FC = () => {
    const { pageId } = useParams<{ studyId: string; stepId: string; pageId: string }>();
    const dispatch = useDispatch();
    const { pageClient, contentClient } = useApiClients();

    const handleLoad = useCallback((pageData: Page) => dispatch(setPage(pageData)), [dispatch]);
    const handleDelete = useCallback(() => dispatch(clearSelectedPage()), [dispatch]);

    if (!pageId) {
        console.warn('Study ID or Step ID is missing from URL. Redirecting to studies listings.');
        return null;
    }
    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<Page>
                resourceClient={pageClient}
                resourceId={pageId}
                onDelete={handleDelete}
                onLoad={handleLoad}
            />
            <div className="flex space-x-2 justify-between gap-4">
                <ResourceChildList<PageContent> resourceClient={contentClient} parentId={pageId} />
            </div>
        </div>
    );
};

export default PageDetails;
