import { useState } from 'react';
import { useApiClients } from '../../api/ApiContext';
import ResourceExplorer from '../../components/resources/ResourceExplorer';
import type { PreShuffledMovieList } from '../../types/studyComponents.types';

const ShuffledMovieListSummary: React.FC = () => {
    return <></>;
};
const ShuffledMovieLists: React.FC = () => {
    const { preShuffledMovieListClient } = useApiClients();
    const [selectedList, setSelectedList] = useState<PreShuffledMovieList | null>(null);

    return (
        <ResourceExplorer<PreShuffledMovieList>
            resourceClient={preShuffledMovieListClient}
            selectedId={selectedList?.id ?? null}
            onSelect={() => {}}
            SummaryComponent={ShuffledMovieListSummary}
            requireCreatePermission={false}
        />
    );
};

export default ShuffledMovieLists;
