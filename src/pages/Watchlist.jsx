import React, { useState, useEffect } from 'react';
import { Trash2, Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';
import { watchlistManager } from '../services/storage';
import logger from '../services/logger.js';
import '../css/Favorites.css';

export default function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    const items = watchlistManager.getAll();
    logger.info('Loaded watchlist', { count: items.length });
    setWatchlistItems(items);
  };

  const handleRemove = (movieId) => {
    const removed = watchlistManager.remove(movieId);
    if (removed) {
      loadWatchlist();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      watchlistManager.clear();
      loadWatchlist();
    }
  };

  const getFilteredItems = () => {
    if (filter === 'movies') {
      return watchlistItems.filter(item => item.media_type === 'movie' || item.release_date);
    } else if (filter === 'tv') {
      return watchlistItems.filter(item => item.media_type === 'tv' || !item.release_date);
    }
    return watchlistItems;
  };

  const filteredItems = getFilteredItems();
  const totalMinutes = watchlistItems.reduce((acc, item) => acc + (item.runtime || 120), 0);
  const hours = Math.floor(totalMinutes / 60);

  return (
    <div className="favorites-page">
      {/* Header */}
      <div className="favorites-header">
        <div className="header-content">
          <h1>🍿 Your Watchlist</h1>
          <p>Movies and shows to watch later</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">{watchlistItems.length}</span>
            <span className="stat-label">Items</span>
          </div>
          <div className="stat">
            <span className="stat-number">{hours}h</span>
            <span className="stat-label">To Watch</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      {watchlistItems.length > 0 && (
        <div className="favorites-controls container">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({watchlistItems.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'movies' ? 'active' : ''}`}
              onClick={() => setFilter('movies')}
            >
              Movies
            </button>
            <button 
              className={`filter-tab ${filter === 'tv' ? 'active' : ''}`}
              onClick={() => setFilter('tv')}
            >
              TV Shows
            </button>
          </div>
          <button className="clear-btn" onClick={handleClearAll}>
            <Trash2 size={18} /> Clear All
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="container">
        {filteredItems.length > 0 ? (
          <div className="favorites-grid">
            {filteredItems.map((item, index) => (
              <div key={`watchlist-${item.id}-${index}`} className="favorites-card">
                <MovieCard 
                  movie={item} 
                  onClick={setSelectedMovie}
                />
                <div className="card-overlay">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from watchlist"
                  >
                    ✕
                  </button>
                  <button 
                    className="play-btn-overlay"
                    onClick={() => setSelectedMovie(item)}
                    title="View details"
                  >
                    <Play size={24} fill="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🍿</div>
            <h2>Your watchlist is empty</h2>
            <p>Start adding movies and shows to keep track of what you want to watch!</p>
            <a href="/" className="cta-button">← Explore Movies</a>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
