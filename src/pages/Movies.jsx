import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BarChart3, Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import MovieDetailModal from '../components/MovieDetailModal';
import { getPopularMovies, getGenres } from '../services/api';
import '../css/Movies.css';
import logger from '../services/logger.js';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const observer = useRef();
  const debounceTimeout = useRef(null);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        logger.error('Failed to load genres', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies when genre or sort changes
  useEffect(() => {
    loadMovies(true);
  }, [selectedGenre, sortBy]);

  const loadMovies = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
    }
    setError(null);
    try {
      const currentPage = reset ? 1 : page;
      const response = await getPopularMovies(currentPage, selectedGenre);
      
      const validMovies = Array.isArray(response) ? response : [];
      setMovies((prev) => (reset ? validMovies : [...prev, ...validMovies]));
      setHasMore(validMovies.length > 0);
      setPage(currentPage + 1);
    } catch (err) {
      logger.error('Failed to load movies', err);
      setError(`Failed to load: ${err.message}`);
    } finally {
      if (reset) setLoading(false);
    }
  };

  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMovies();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div className="movies-page">
      {/* Page Header */}
      <div className="movies-header">
        <h1>🎬 Movies</h1>
        <p>Discover thousands of movies</p>
      </div>

      {/* Controls */}
      <div className="movies-controls container">
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} /> Filters
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-section">
              <h3>Genre</h3>
              <div className="genre-buttons">
                <button
                  className={`genre-btn ${selectedGenre === null ? 'active' : ''}`}
                  onClick={() => handleGenreClick(null)}
                >
                  All Genres
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
                    onClick={() => handleGenreClick(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Sort By</h3>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="popularity.desc">Popularity (High to Low)</option>
                <option value="release_date.desc">Latest Released</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="title.asc">Title (A-Z)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map((movie, index) => {
              const uniqueKey = `movie-${movie.id}-${index}`;
              if (index === movies.length - 1) {
                return (
                  <div ref={lastMovieRef} key={uniqueKey}>
                    <MovieCard movie={movie} onClick={setSelectedMovie} />
                  </div>
                );
              }
              return (
                <MovieCard
                  key={uniqueKey}
                  movie={movie}
                  onClick={setSelectedMovie}
                />
              );
            })
          ) : (
            !loading && <div className="no-results">No movies found. Try different filters! 🎬</div>
          )}

          {loading && Array.from({ length: page === 1 ? 20 : 5 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${page}-${i}`} />
          ))}
        </div>
      </div>

      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
