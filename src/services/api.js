const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getPopularMovies(page = 1, genreId = null, sortBy = 'popularity.desc') {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      page: page,
      sort_by: sortBy,
    });

    if (genreId) {
      params.append('with_genres', genreId);
    }

    const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

export async function getGenres() {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
    });

    const response = await fetch(`${BASE_URL}/genre/movie/list?${params}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

export async function getTvShows(page = 1, genreId = null, sortBy = 'popularity.desc') {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      page: page,
      sort_by: sortBy,
    });

    if (genreId) {
      params.append('with_genres', genreId);
    }

    const response = await fetch(`${BASE_URL}/discover/tv?${params}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
}

export async function searchMovies(query, page = 1) {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      query: query,
      page: page,
    });

    const response = await fetch(`${BASE_URL}/search/movie?${params}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function getTrendingMovies(page = 1) {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      page: page,
    });

    const response = await fetch(`${BASE_URL}/trending/movie/week?${params}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

export async function getTVGenres() {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
    });

    const response = await fetch(`${BASE_URL}/genre/tv/list?${params}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching TV genres:', error);
    return [];
  }
}
