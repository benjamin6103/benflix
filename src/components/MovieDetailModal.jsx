import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Share2, Heart, BookmarkPlus, Bookmark } from 'lucide-react';
import { watchlistManager, favoritesManager } from '../services/storage.js';
import '../css/MovieDetailModal.css';

function MovieDetailModal({ movie, onClose }) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Check initial states
    setInWatchlist(watchlistManager.isInWatchlist(movie.id));
    setIsFavorited(favoritesManager.isFavorited(movie.id));
    
    // Add keyboard event listener for ESC key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, movie.id]);

  if (!movie) return null;

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const backdrop = movie.backdrop_path ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` : 'none';
  const isPerson = movie.media_type === 'person';

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      watchlistManager.remove(movie.id);
      setInWatchlist(false);
    } else {
      watchlistManager.add(movie);
      setInWatchlist(true);
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      favoritesManager.remove(movie.id);
      setIsFavorited(false);
    } else {
      favoritesManager.add(movie);
      setIsFavorited(true);
    }
  };

  const handleShare = (platform) => {
    const shareText = `Check out "${title}" on BENFLIX! 🎬`;
    const shareUrl = window.location.href;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      copy: null,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2000);
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Prevent background clicks from closing if clicking content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-background-blur" 
        style={{ backgroundImage: backdrop }}
      />
      <div className="modal-content-wrapper">
        <div className="movie-modal" onClick={handleContentClick}>
          <button className="close-btn" onClick={onClose} aria-label="Close modal" title="Press ESC to close">&times;</button>
          
          <div className="modal-hero" style={{ backgroundImage: backdrop }}>
            <div className="modal-hero-gradient" />
          </div>

          <div className="modal-body">
            <h2 className="modal-title">{title}</h2>
            <div className="modal-meta">
              {releaseDate && <span className="meta-year">{releaseDate.split('-')[0]}</span>}
              {!isPerson && movie.vote_average > 0 && (
                <span className="meta-rating">
                  ⭐ {(movie.vote_average).toFixed(1)}
                </span>
              )}
            </div>

            <p className="modal-overview">
              {movie.overview || (isPerson ? "No information available." : "No description available.")}
            </p>

            <div className="modal-actions">
              {!isPerson && (
                <button className="modal-btn play-btn" title="Trailer functionality coming soon">
                  ▶ Play Trailer
                </button>
              )}
              
              <button 
                className={`modal-btn watchlist-btn ${inWatchlist ? 'active' : ''}`} 
                onClick={handleWatchlistToggle}
                title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {inWatchlist ? <Bookmark size={18} /> : <BookmarkPlus size={18} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button 
                className={`modal-btn favorite-btn ${isFavorited ? 'active' : ''}`}
                onClick={handleFavoriteToggle}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </button>

              <div className="share-menu-container">
                <button 
                  className="modal-btn share-btn" 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  title="Share this movie"
                >
                  <Share2 size={18} />
                  Share
                </button>
                {showShareMenu && (
                  <div className="share-menu">
                    <button onClick={() => handleShare('twitter')}>𝕏 Twitter</button>
                    <button onClick={() => handleShare('facebook')}>f Facebook</button>
                    <button onClick={() => handleShare('copy')}>📋 Copy Link</button>
                  </div>
                )}
              </div>

              {isPerson && (
                <button className="modal-btn" title="View full profile" style={{
                  backgroundColor: '#ff9f1c',
                  color: '#000',
                }}>
                  👤 View Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {copyNotification && (
        <div className="copy-notification">
          ✅ Link copied to clipboard!
        </div>
      )}
    </div>
  );
}

MovieDetailModal.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    overview: PropTypes.string,
    backdrop_path: PropTypes.string,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    vote_average: PropTypes.number,
    media_type: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

MovieDetailModal.defaultProps = {
  movie: null,
};

export default MovieDetailModal;
