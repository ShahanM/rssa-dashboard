import { XMarkIcon, PencilSquareIcon, CheckIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import type { MovieDetails } from "../../types/movies.types";
import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MovieDetailsPanel = ({ movie, onClose }: { movie: MovieDetails; onClose: () => void; }) => {
    if (!movie) return null;
    const { api } = useApi();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        director: movie.director,
        cast: movie.cast,
        description: movie.description,
        poster: movie.poster,
        imdb_avg_rating: movie.imdb_avg_rating,
        imdb_rate_count: movie.imdb_rate_count,
        tmdb_avg_rating: movie.tmdb_avg_rating,
        tmdb_rate_count: movie.tmdb_rate_count,
    });

    useEffect(() => {
        setEditForm({
            title: movie.title,
            year: movie.year,
            genre: movie.genre,
            director: movie.director,
            cast: movie.cast,
            description: movie.description,
            poster: movie.poster,
            imdb_avg_rating: movie.imdb_avg_rating,
            imdb_rate_count: movie.imdb_rate_count,
            tmdb_avg_rating: movie.tmdb_avg_rating,
            tmdb_rate_count: movie.tmdb_rate_count,
        });
    }, [movie]);

    const hasChanges = useMemo(() => {
        return (
            editForm.title !== movie.title ||
            editForm.year !== movie.year ||
            editForm.genre !== movie.genre ||
            editForm.director !== movie.director ||
            editForm.cast !== movie.cast ||
            editForm.description !== movie.description ||
            editForm.poster !== movie.poster ||
            editForm.imdb_avg_rating !== movie.imdb_avg_rating ||
            editForm.imdb_rate_count !== movie.imdb_rate_count ||
            editForm.tmdb_avg_rating !== movie.tmdb_avg_rating ||
            editForm.tmdb_rate_count !== movie.tmdb_rate_count
        );
    }, [editForm, movie]);

    const isInvalid = useMemo(() => {
        const imdbRatingChanged = editForm.imdb_avg_rating !== movie.imdb_avg_rating;
        const imdbCountChanged = editForm.imdb_rate_count !== movie.imdb_rate_count;
        const tmdbRatingChanged = editForm.tmdb_avg_rating !== movie.tmdb_avg_rating;
        const tmdbCountChanged = editForm.tmdb_rate_count !== movie.tmdb_rate_count;

        // If rating changed, count MUST also change. If count changed, rating MUST also change.
        // Basically, change status for both must be equal.
        const imdbInvalid = imdbRatingChanged !== imdbCountChanged;
        const tmdbInvalid = tmdbRatingChanged !== tmdbCountChanged;

        return imdbInvalid || tmdbInvalid;
    }, [editForm, movie]);

    const updateMovieMutation = useMutation({
        mutationFn: async (updatedData: typeof editForm) => {
            return api.patch<MovieDetails>(`movies/${movie.id}`, updatedData);
        },
        onSuccess: () => {
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            // Optionally update local movie object if needed, but invalidation should re-fetch parent list
            // However, parent passes 'movie' prop. If parent re-fetches, it might update 'movie' prop?
            // Actually PaginatedResourceViewer handles list. If list refreshes, parent re-renders.
            // But 'selectedItem' in parent might be stale?
            // PaginatedResourceViewer update:
            // We might need to call a callback to update parent's selected item?
            // For now, let's rely on invalidating 'movies' query.
        },
        onError: (err) => {
            console.error("Failed to update movie", err);
            alert("Failed to update movie.");
        }
    });

    const handleSave = () => {
        updateMovieMutation.mutate(editForm);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            title: movie.title,
            year: movie.year,
            genre: movie.genre,
            director: movie.director,
            cast: movie.cast,
            description: movie.description,
            poster: movie.poster,
            imdb_avg_rating: movie.imdb_avg_rating,
            imdb_rate_count: movie.imdb_rate_count,
            tmdb_avg_rating: movie.tmdb_avg_rating,
            tmdb_rate_count: movie.tmdb_rate_count,
        });
    };

    const ignoredEmotionKeys = new Set(['id', 'movie_id', 'movielens_id']);
	return (
		<div className={clsx(
			"bg-white dark:bg-gray-800 p-6 rounded-lg",
			"shadow-xl h-[75vh] overflow-y-auto relative",
			"scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700"
		)}>
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <span className="sr-only">Close details panel</span>
                    <XMarkIcon className="h-6 w-6" />
                </button>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" title="Edit Movie">
                        <PencilSquareIcon className="h-6 w-6" />
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleSave} 
                            disabled={!hasChanges || isInvalid}
                            className={clsx(
                                "text-green-500 hover:text-green-700 dark:hover:text-green-400",
                                (!hasChanges || isInvalid) && "opacity-50 cursor-not-allowed text-gray-400 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-600"
                            )}
                            title={
                                !hasChanges 
                                    ? "No changes to save" 
                                    : isInvalid 
                                        ? "Ratings and counts must be updated together" 
                                        : "Save Changes"
                            }
                        >
                            <CheckIcon className="h-6 w-6" />
                        </button>
                        <button onClick={handleCancel} className="text-red-500 hover:text-red-700 dark:hover:text-red-400" title="Cancel">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
			
			{/**
			 * Left panel showing the movie ratings and meta information.
			 */}
			<div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink w-2/5">
                    <div className="relative group">
                        <img
                            className="w-48 rounded-lg shadow-md border-4 border-gray-200 dark:border-gray-700"
                            src={isEditing ? editForm.poster : movie.poster}
                            alt={`Poster for ${movie.title}`}
                            onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/400x600/000000/FFFFFF?text=No+Image';
                            }}
                        />
                        {isEditing && (
                            <input
                                type="text"
                                className="mt-2 w-full text-sm p-1 border rounded dark:bg-gray-700 dark:text-white"
                                placeholder="Poster URL"
                                value={editForm.poster}
                                onChange={(e) => setEditForm({ ...editForm, poster: e.target.value })}
                            />
                        )}
                    </div>

					{/**
					 * Movie ratings and rating counts
					 */}
					{/**
					 * Movie ratings and rating counts
					 */}
					<dl>
						<dt className="font-bold text-yellow-500 mt-3">Ratings</dt>
						<dd className="text-yellow-400 flex items-center gap-2">
                            <span>IMDB:</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    className="w-16 text-sm p-1 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                    value={editForm.imdb_avg_rating || ''}
                                    onChange={(e) => setEditForm({ ...editForm, imdb_avg_rating: parseFloat(e.target.value) || 0 })}
                                />
                            ) : (
                                <span>{movie.imdb_avg_rating?.toFixed(1) ?? 'N/A'}</span>
                            )}
                            <span className="text-gray-500 text-sm">/ 10.0</span>
						</dd>
						<dd className="text-yellow-400 flex items-center gap-2 mt-1">
							<span>TMDB:</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    className="w-16 text-sm p-1 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                    value={editForm.tmdb_avg_rating || ''}
                                    onChange={(e) => setEditForm({ ...editForm, tmdb_avg_rating: parseFloat(e.target.value) || 0 })}
                                />
                            ) : (
                                <span>{movie.tmdb_avg_rating?.toFixed(1) ?? 'N/A'}</span>
                            )}
                            <span className="text-gray-500 text-sm">/ 10.0</span>
						</dd>

						<dt className="font-bold text-yellow-500 mt-3">Rating counts</dt>
						<dd className="text-yellow-400 flex items-center gap-2">
                            <span>IMDB:</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    className="w-24 text-sm p-1 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                    value={editForm.imdb_rate_count || ''}
                                    onChange={(e) => setEditForm({ ...editForm, imdb_rate_count: parseInt(e.target.value) || 0 })}
                                />
                            ) : (
                                <span>{movie.imdb_rate_count ?? 'N/A'}</span>
                            )}
                        </dd>
						<dd className="text-yellow-400 flex items-center gap-2 mt-1">
                            <span>TMDB:</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    className="w-24 text-sm p-1 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                    value={editForm.tmdb_rate_count || ''}
                                    onChange={(e) => setEditForm({ ...editForm, tmdb_rate_count: parseInt(e.target.value) || 0 })}
                                />
                            ) : (
                                <span>{movie.tmdb_rate_count ?? 'N/A'}</span>
                            )}
                        </dd>
					</dl>
					
					{/**
					 * Director and Cast block
					 */}
                    <div className="mt-3">
                        <dl className={clsx(
                            "list-disc list-inside mt-2 space-y-1",
                            "text-gray-700 dark:text-gray-300"
                        )}>
                            <dt className="mt-5 font-bold">Director</dt>
                            <dd>
                                {isEditing ? (
                                    <input
                                        className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                                        value={editForm.director || ''}
                                        onChange={(e) => setEditForm({ ...editForm, director: e.target.value })}
                                    />
                                ) : (movie.director)}
                            </dd>

                            <dt className="mt-5 font-bold">Cast</dt>
                            <dd>
                                {isEditing ? (
                                    <textarea
                                        className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                                        rows={3}
                                        value={editForm.cast}
                                        onChange={(e) => setEditForm({ ...editForm, cast: e.target.value })}
                                    />
                                ) : (movie.cast)}
                            </dd>
                        </dl>
                    </div>
				</div>

				{/**
				 * Right panel showing movie information 
				 */}
                <div className="flex-grow w-3/5 pr-14">
                    {isEditing ? (
                        <div className="flex gap-2 mb-2">
                            <input
                                className="text-2xl font-bold w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Title"
                            />
                            <input
                                className="text-2xl font-bold w-24 p-1 border rounded dark:bg-gray-700 dark:text-white"
                                type="number"
                                value={editForm.year}
                                onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) || 0 })}
                                placeholder="Year"
                            />
                        </div>
                    ) : (
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{movie.title} ({movie.year})</h2>
                    )}

                    <div className="flex mt-1">
                        {isEditing ? (
                            <input
                                className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                                value={editForm.genre}
                                onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                                placeholder="Genres (pipe separated)"
                            />
                        ) : (
                            movie.genre.split("|").map((genre: string) => {
                                return (
                                    <p key={genre} className={clsx(
                                        "m-1 ps-1 pe-1 border rounded-xl border-yellow-300",
                                        "bg-yellow-500",
                                        "text-sm text-gray-900 dark:text-black mt-1"
                                    )}>
                                        {genre}
                                    </p>
                                )
                            })
                        )}
                    </div>

					<dl className="text-sm italic mt-5 border rounded-lg p-3 border-yellow-300">
						<dt className="font-semibold">MovideID</dt>
						<dd className="font-light">{movie.id}</dd>

						<dt className="font-semibold mt-1">IMDB ID</dt>
						<dd className="font-light">{`tt${movie.imdb_id}`}</dd>

						<dt className="font-semibold mt-1">TMDB ID</dt>
						<dd className="font-light">{movie.tmdb_id}</dd>
					</dl>


                    <dl className="mt-5 border rounded-lg p-3 border-yellow-300">
                        <dt className="font-bold text-gray-800 dark:text-gray-200">Synopsis</dt>
                        <dd className="text-gray-700 dark:text-gray-300 mt-1">
                            {isEditing ? (
                                <textarea
                                    className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                                    rows={5}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                />
                            ) : (movie.description)}
                        </dd>
                    </dl>
					
					{/**
					 * The movie emotions on Plutchick's 8 dimensions
					 */}
					{movie.emotions &&
						<div className="mt-5 border rounded-lg p-3 border-yellow-300">
							<h4 className="font-bold text-gray-800 dark:text-gray-200">Emotions</h4>
							<dl className="grid grid-cols-[max-content_1fr]">
								{Object.entries(movie.emotions)
									.filter(([key]) => !ignoredEmotionKeys.has(key))
									.map(([emotion, val]) =>
										<>
											<dt className="font-semibold">{emotion}</dt>
											<dd className="text-gray-700 dark:text-gray-300 ms-3 font-mono">
												{(val as number).toFixed(9)}
											</dd>
										</>)}
							</dl>
						</div>
					}

					{/**
					 * The LLM generated text recommending the movie
					 */}
					{movie.recommendations_text &&
						<div className="mt-5 border rounded-lg p-3 border-yellow-300">
							<h4 className="font-bold text-gray-800 dark:text-gray-200">LLM Recommendation</h4>
							<dl>
								<dt className="font-semibold">Formal</dt>
								<dd className="text-gray-700 dark:text-gray-300 mt-1">
									{movie.recommendations_text.formal}
								</dd>

								<dt className="font-semibold mt-1">Informal</dt>
								<dd className="text-gray-700 dark:text-gray-300 mt-1">
									{movie.recommendations_text.informal}
								</dd>
							</dl>
						</div>
					}

				</div>
			</div>
		</div>
	);
};

export default MovieDetailsPanel;