import React from 'react';
import PropTypes from 'prop-types';

const MovieCard = ({ movie, onClick }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="movie-poster">
        <img
          src={posterUrl}
          alt={movie.title || movie.name}
          loading="lazy"
        />
        <div className="movie-overlay">
          <div className="rating">{movie.vote_average?.toFixed(1)}</div>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title || movie.name}</h3>
        <p className="release-date">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
    release_date: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MovieCard;
