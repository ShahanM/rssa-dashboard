import { FunnelIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

export interface MovieFilterState {
    title: string;
    yearMin: number | '';
    yearMax: number | '';
    genre: string;
    sortBy: string;
}

interface MovieFiltersProps {
    filters: MovieFilterState;
    onFilterChange: (filters: MovieFilterState) => void;
}

const MovieFilters: React.FC<MovieFiltersProps> = ({ filters, onFilterChange }) => {
    // Local state for debouncing
    const [localFilters, setLocalFilters] = useState<MovieFilterState>(filters);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange(localFilters);
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [localFilters, onFilterChange]);

    const handleChange = (field: keyof MovieFilterState, value: string | number) => {
        setLocalFilters((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 transition-all duration-300">
            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <h2 className="text-lg font-semibold flex items-center">
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    Filters & Search
                </h2>
                <button
                    className="text-sm text-blue-500 hover:underline focus:outline-none"
                    onClick={(e) => {
                        e.stopPropagation();
                        setLocalFilters({ title: '', yearMin: '', yearMax: '', genre: '', sortBy: '' });
                    }}
                >
                    Clear All
                </button>
            </div>

            <div className={clsx("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", { "hidden": !isExpanded, "grid": isExpanded })}>
                {/* Title Search */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                        type="text"
                        placeholder="Search title..."
                        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={localFilters.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                {/* Genre Search */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
                    <input
                        type="text"
                        placeholder="e.g. Action"
                        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={localFilters.genre}
                        onChange={(e) => handleChange('genre', e.target.value)}
                    />
                </div>

                {/* Year Min */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year From</label>
                    <input
                        type="number"
                        placeholder="Min Year"
                        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={localFilters.yearMin}
                        onChange={(e) => handleChange('yearMin', e.target.value ? parseInt(e.target.value) : '')}
                    />
                </div>

                {/* Year Max */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year To</label>
                    <input
                        type="number"
                        placeholder="Max Year"
                        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={localFilters.yearMax}
                        onChange={(e) => handleChange('yearMax', e.target.value ? parseInt(e.target.value) : '')}
                    />
                </div>

                {/* Sort By */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <select
                        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={localFilters.sortBy}
                        onChange={(e) => handleChange('sortBy', e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="year">Year (Asc)</option>
                        <option value="-year">Year (Desc)</option>
                        <option value="title">Title (A-Z)</option>
                        <option value="-title">Title (Z-A)</option>
                        <option value="imdb_avg_rating">Rating (Asc)</option>
                        <option value="-imdb_avg_rating">Rating (Desc)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default MovieFilters;
