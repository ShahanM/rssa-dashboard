import clsx from 'clsx';
import type { MovieDetails } from '../../types/movies.types';

const MovieCard = ({
    movie,
    onClick,
    isSelected,
}: {
    movie: MovieDetails;
    onClick: () => void;
    isSelected: boolean;
}) => (
    <div
        onClick={onClick}
        className={clsx(
            'relative group rounded-lg overflow-hidden shadow-lg',
            'transform transition-transform duration-300 hover:scale-105 cursor-pointer',
            { 'ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900': isSelected }
        )}
    >
        <img
            className="w-full h-full object-cover"
            src={movie.poster}
            alt={`Poster for ${movie.title}`}
            onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x600/000000/FFFFFF?text=No+Image';
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4">
                <h4 className="text-white text-lg font-bold">{movie.title}</h4>
                <p className="text-gray-300 text-sm">{movie.year}</p>
            </div>
        </div>
    </div>
);

export default MovieCard;
