import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import MovieDetailModal from '../components/MovieDetailModal';
import { getTrendingMovies, getTVGenres } from '../services/api';
import '../css/TvShows.css';
import logger from '../services/logger.js';

export default function TvShows() {
  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch TV genres on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreList = await getTVGenres();
        setGenres(genreList || []);
        
        // Fetch trending TV shows
        const BASE_URL = "https://api.themoviedb.org/3";
        const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWY1YzVmNDc2Mzg0ZWFhZDNjZDNiMzhhZDU2NWQ3ZSIsIm5iZiI6MTc1NTAwNjI5Mi4zMjgsInN1YiI6IjY4OWI0NTU0ODBmNWQwZWZjZWI3MDkwNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cu4O6cJbSIVy7DM--5K7LU_rWGvzSXa3nVzfcIOKhC0";
        const headers = { Authorization: `Bearer ${ACCESS_TOKEN}`, accept: "application/json" };
        
        const response = await fetch(`${BASE_URL}/trending/tv/day`, { headers });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const shows = (data.results || []).map(s => ({ ...s, media_type: 'tv' }));
        
        setTvShows(shows);
      } catch (err) {
        logger.error('Failed to load TV shows', err);
        setError('Failed to load TV shows. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };

  return (
    <div className="tv-shows-page">
      {/* Page Header */}
      <div className="tv-header">
        <h1>📺 TV Shows</h1>
        <p>Binge-worthy series and shows</p>
      </div>

      {/* Controls */}
      <div className="tv-controls container">
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
                {genres.slice(0, 12).map((genre) => (
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

            <div className="filter-info">
              💡 Showing trending TV shows. More filtering options coming soon!
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="tv-grid">
          {!loading && tvShows.length > 0 ? (
            tvShows.map((show, index) => (
              <MovieCard
                key={`show-${show.id}-${index}`}
                movie={show}
                onClick={setSelectedShow}
              />
            ))
          ) : (
            !loading && <div className="no-results">No TV shows found. Check back soon! 📺</div>
          )}

          {loading && Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
        </div>
      </div>

      {selectedShow && (
        <MovieDetailModal movie={selectedShow} onClose={() => setSelectedShow(null)} />
      )}
    </div>
  );
}
