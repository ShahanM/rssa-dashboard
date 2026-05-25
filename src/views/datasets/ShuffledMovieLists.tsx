import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useApiClients } from '../../api/ApiContext';
import DeleteResourceButton from '../../components/buttons/DeleteResourceButton';
import ResourceExplorer from '../../components/resources/ResourceExplorer';
import { useApi } from '../../hooks/useApi';
import { clearSelectedShuffledList, selectShuffledList, setShuffledList } from '../../store/datasets/selectionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { MovieDetails } from '../../types/movies.types';
import type { PaginatedResourceList, PreShuffledMovieList } from '../../types/studyComponents.types';
import MovieCard from '../moviedatabase/MovieCard';

const ShuffledMovieListSummary: React.FC = () => {
    const { api } = useApi();
    const { preShuffledMovieListClient } = useApiClients();

    const selectedList = useAppSelector(selectShuffledList);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(18);
    const dispatch = useAppDispatch();

    const queryClient = useQueryClient();

    useEffect(() => {
        setPage(0);
    }, [selectedList]);
    const { data, isFetching } = useQuery({
        queryKey: ['shuffled-list-movies', selectedList?.id, page, pageSize],
        queryFn: async () => {
            const offset = page * pageSize;
            return api.get<PaginatedResourceList<MovieDetails>>(
                `shuffled-lists/${selectedList!.id}/movies?offset=${offset}&limit=${pageSize}`
            );
        },
        enabled: !!selectedList?.id,
        placeholderData: (previousData) => previousData,
    });

    const handleDelete = useCallback(() => {
        dispatch(clearSelectedShuffledList());
        queryClient.invalidateQueries({
            queryKey: preShuffledMovieListClient.queryKeys.lists(),
        });
    }, [dispatch, preShuffledMovieListClient.queryKeys, queryClient]);

    if (!selectedList) {
        return <div className="text-gray-500 italic p-4">Select a shuffled list to view its distribution.</div>;
    }

    const movies = data?.data || [];
    const totalPages = data?.page_count || 1;

    return (
        <div className="bg-white p-6 rounded-lg shadow min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{selectedList.subset_desc}</h3>

                <DeleteResourceButton
                    resourceClient={preShuffledMovieListClient}
                    resourceId={selectedList.id!}
                    onDelete={handleDelete}
                />
            </div>

            <div className="my-6 flex justify-between">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Preview Layout:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(0);
                        }}
                        className="p-2 w-full border rounded-md bg-gray-50 text-sm focus:ring-purple-500"
                    >
                        <option value={12}>12 items / page</option>
                        <option value={18}>18 items / page</option>
                        <option value={24}>24 items / page</option>
                        <option value={30}>30 items / page</option>
                    </select>
                </div>
                <p className="text-sm text-gray-500 align-bottom">Total Items: {data?.total || '...'}</p>
            </div>

            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 flex-grow transition-opacity duration-200"
                style={{ opacity: isFetching ? 0.5 : 1 }}
            >
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} isSelected={false} onClick={() => {}} />
                ))}
            </div>

            <div className="flex justify-center items-center mt-6 pt-4 border-t gap-4">
                <button
                    disabled={page === 0 || isFetching}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 bg-gray-100 rounded-md disabled:opacity-50 hover:bg-gray-200"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                    Page {page + 1} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages - 1 || isFetching}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 bg-gray-100 rounded-md disabled:opacity-50 hover:bg-gray-200"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
const ShuffledMovieLists: React.FC = () => {
    const { preShuffledMovieListClient } = useApiClients();

    const selectedList = useAppSelector(selectShuffledList);
    const dispatch = useAppDispatch();

    return (
        <ResourceExplorer<PreShuffledMovieList>
            resourceClient={preShuffledMovieListClient}
            selectedId={selectedList?.id ?? null}
            onSelect={(list) => dispatch(setShuffledList(list))}
            SummaryComponent={ShuffledMovieListSummary}
            requireCreatePermission={false}
        />
    );
};

export default ShuffledMovieLists;
