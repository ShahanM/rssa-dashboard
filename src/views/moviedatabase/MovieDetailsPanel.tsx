import { XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import type { MovieDetails } from "../../types/movies.types";


const MovieDetailsPanel = ({ movie, onClose }: { movie: MovieDetails; onClose: () => void; }) => {
	if (!movie) return null;
	const ignoredEmotionKeys = new Set(['id', 'movie_id', 'movielens_id']);
	return (
		<div className={clsx(
			"bg-white dark:bg-gray-800 p-6 rounded-lg",
			"shadow-xl h-[75vh] overflow-y-auto relative",
			"scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700"
		)}>
			<button onClick={onClose} className={clsx(
				"absolute top-4 right-4",
				"text-gray-500 hover:text-gray-800 dark:hover:text-white z-10")}>
				<span className="sr-only">Close details panel</span>
				<XMarkIcon className="h-6 w-6" />
			</button>
			
			{/**
			 * Left panel showing the movie ratings and meta information.
			 */}
			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex-shrink w-2/5">
					<img
						className="w-48 rounded-lg shadow-md border-4 border-gray-200 dark:border-gray-700"
						src={movie.poster}
						alt={`Poster for ${movie.title}`}
						onError={(e) => {
							e.currentTarget.src = 'https://placehold.co/400x600/000000/FFFFFF?text=No+Image';
						}}
					/>

					{/**
					 * Movie ratings and rating counts
					 */}
					<dl>
						<dt className="font-bold text-yellow-500 mt-3">Ratings</dt>
						<dd className="text-yellow-400">
							IMDB:&nbsp;&nbsp;{movie.imdb_avg_rating?.toFixed(1)} / 10.0
						</dd>
						<dd className="text-yellow-400">
							TMDB:&nbsp;&nbsp;{movie.tmdb_avg_rating?.toFixed(1)} / 10.0
						</dd>

						<dt className="font-bold text-yellow-500 mt-3">Rating counts</dt>
						<dd className="text-yellow-400">IMDB:&nbsp;&nbsp;{movie.imdb_rate_count}</dd>
						<dd className="text-yellow-400">TMDB:&nbsp;&nbsp;{movie.tmdb_rate_count}</dd>
					</dl>
					
					{/**
					 * Director and Cast block
					 */}
					<div className="mt-3">
						<dl className={clsx(
							"list-disc list-inside mt-2 space-y-1",
							"text-gray-700 dark:text-gray-300"
						)}>
							{movie.director &&
								<>
									<dt className="mt-5 font-bold">Director</dt>
									<dd>{movie.director}</dd>
								</>
							}
							<dt className="mt-5 font-bold">Cast</dt>
							<dd>{movie.cast}</dd>
						</dl>
					</div>
				</div>

				{/**
				 * Right panel showing movie information 
				 */}
				<div className="flex-grow w-3/5">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">{movie.title} ({movie.year})</h2>
					<div className="flex mt-1">
						{movie.genre.split("|").map((genre: string) => {
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
						}
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
						<dd className="text-gray-700 dark:text-gray-300 mt-1">{movie.description}</dd>
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