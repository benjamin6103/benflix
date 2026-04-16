import logger from './logger.js';

const STORAGE_KEYS = {
  WATCHLIST: 'benflix_watchlist',
  FAVORITES: 'benflix_favorites',
  WATCH_HISTORY: 'benflix_watch_history',
  USER_STATS: 'benflix_stats',
};

// Safe localStorage operations with error handling
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      logger.error('Storage read error', error, { key });
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Storage write error', error, { key });
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error('Storage remove error', error, { key });
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error('Storage clear error', error);
      return false;
    }
  },
};

// Watchlist management
export const watchlistManager = {
  getAll: () => {
    const watchlist = storage.get(STORAGE_KEYS.WATCHLIST) || [];
    logger.debug('Retrieved watchlist', { count: watchlist.length });
    return watchlist;
  },

  add: (movie) => {
    const watchlist = watchlistManager.getAll();
    if (!watchlist.find(m => m.id === movie.id)) {
      watchlist.push({
        ...movie,
        addedAt: new Date().toISOString(),
      });
      storage.set(STORAGE_KEYS.WATCHLIST, watchlist);
      logger.info('Movie added to watchlist', { movieId: movie.id, title: movie.title || movie.name });
      return true;
    }
    logger.debug('Movie already in watchlist', { movieId: movie.id });
    return false;
  },

  remove: (movieId) => {
    const watchlist = watchlistManager.getAll();
    const filtered = watchlist.filter(m => m.id !== movieId);
    if (filtered.length !== watchlist.length) {
      storage.set(STORAGE_KEYS.WATCHLIST, filtered);
      logger.info('Movie removed from watchlist', { movieId });
      return true;
    }
    return false;
  },

  isInWatchlist: (movieId) => {
    return watchlistManager.getAll().some(m => m.id === movieId);
  },

  clear: () => {
    storage.remove(STORAGE_KEYS.WATCHLIST);
    logger.info('Watchlist cleared');
  },
};

// Favorites management
export const favoritesManager = {
  getAll: () => {
    const favorites = storage.get(STORAGE_KEYS.FAVORITES) || [];
    logger.debug('Retrieved favorites', { count: favorites.length });
    return favorites;
  },

  add: (movie) => {
    const favorites = favoritesManager.getAll();
    if (!favorites.find(m => m.id === movie.id)) {
      favorites.unshift({
        ...movie,
        favoritedAt: new Date().toISOString(),
      });
      storage.set(STORAGE_KEYS.FAVORITES, favorites);
      logger.info('Movie added to favorites', { movieId: movie.id, title: movie.title || movie.name });
      return true;
    }
    logger.debug('Movie already favorited', { movieId: movie.id });
    return false;
  },

  remove: (movieId) => {
    const favorites = favoritesManager.getAll();
    const filtered = favorites.filter(m => m.id !== movieId);
    if (filtered.length !== favorites.length) {
      storage.set(STORAGE_KEYS.FAVORITES, filtered);
      logger.info('Movie removed from favorites', { movieId });
      return true;
    }
    return false;
  },

  toggle: (movie) => {
    if (favoritesManager.isFavorited(movie.id)) {
      return favoritesManager.remove(movie.id);
    }
    return favoritesManager.add(movie);
  },

  isFavorited: (movieId) => {
    return favoritesManager.getAll().some(m => m.id === movieId);
  },

  clear: () => {
    storage.remove(STORAGE_KEYS.FAVORITES);
    logger.info('Favorites cleared');
  },
};

// User statistics
export const statsManager = {
  getStats: () => {
    return storage.get(STORAGE_KEYS.USER_STATS) || {
      moviesWatched: 0,
      moviesLiked: 0,
      hoursSpent: 0,
      favoritesCount: 0,
      watchlistCount: 0,
      lastWatched: null,
    };
  },

  updateStats: (updates) => {
    const stats = statsManager.getStats();
    const updated = { ...stats, ...updates };
    storage.set(STORAGE_KEYS.USER_STATS, updated);
    logger.debug('Stats updated', updated);
    return updated;
  },

  incrementWatchlist: () => {
    const stats = statsManager.getStats();
    statsManager.updateStats({
      watchlistCount: (stats.watchlistCount || 0) + 1,
    });
  },

  decrementWatchlist: () => {
    const stats = statsManager.getStats();
    if ((stats.watchlistCount || 0) > 0) {
      statsManager.updateStats({
        watchlistCount: stats.watchlistCount - 1,
      });
    }
  },

  incrementFavorites: () => {
    const stats = statsManager.getStats();
    statsManager.updateStats({
      favoritesCount: (stats.favoritesCount || 0) + 1,
    });
  },

  decrementFavorites: () => {
    const stats = statsManager.getStats();
    if ((stats.favoritesCount || 0) > 0) {
      statsManager.updateStats({
        favoritesCount: stats.favoritesCount - 1,
      });
    }
  },
};

export { STORAGE_KEYS };
export default storage;
