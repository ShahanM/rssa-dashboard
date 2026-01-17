import clsx from "clsx";
import PaginatedResourceViewer from "../../components/resources/PaginatedResourceViewer";
import type { MovieDetails } from "../../types/movies.types";
import MovieDetailsPanel from "./MovieDetailsPanel";
import MovieCard from "./MovieCard";
import { useState } from "react";
import MovieFilters, { type MovieFilterState } from "./MovieFilters";

const MovieDatabase: React.FC = () => {
    const [filters, setFilters] = useState<MovieFilterState>({
        title: '',
        yearMin: '',
        yearMax: '',
        genre: '',
        sortBy: '',
    });

    // Convert filter state to API usable query params
    const queryParams = {
        title: filters.title || undefined,
        year_min: filters.yearMin || undefined,
        year_max: filters.yearMax || undefined,
        genre: filters.genre || undefined,
        sort_by: filters.sortBy || undefined,
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
            <main className="container mx-auto p-4">
                <MovieFilters filters={filters} onFilterChange={setFilters} />
                <PaginatedResourceViewer<MovieDetails> 
                    apiResourceTag="movies" 
                    limit={15}
                    queryParams={queryParams}
                >
                    {(movies, selectedItem, handleItemClick) => (
                        <div className="flex gap-6">
                            <div className={clsx(
                                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6",
                                "transition-all duration-300 ease-in-out",
                                { "w-full": !selectedItem, "w-3/5": selectedItem }
                            )}>
                                {movies.length > 0 ? movies.map((movie) => {
                                    // console.log("MOVIE", movie);
                                    return (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onClick={() => handleItemClick(movie)}
                                            isSelected={selectedItem?.id === movie.id}
                                        />
                                    )
                                }) : <p>No movies found for this page.</p>}
                            </div>
                            <div className={clsx(
                                "transition-all duration-500 ease-in-out transform",
                                {
                                    "w-2/5 opacity-100 translate-x-0": selectedItem,
                                    "w-0 opacity-0 -translate-x-full": !selectedItem
                                }
                            )}>
                                {selectedItem && (
                                    <MovieDetailsPanel
                                        movie={selectedItem}
                                        onClose={() => handleItemClick(selectedItem)}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </PaginatedResourceViewer>
            </main>
        </div>
    );
};

export default MovieDatabase;