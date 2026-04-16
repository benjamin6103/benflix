import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';
import '../css/AiAssistantUI.css';

function AiAssistantUI({ query, movies, onMovieClick }) {
  const [isTyping, setIsTyping] = useState(true);

  // Simulate AI typing delay
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1200);
    return () => clearTimeout(timer);
  }, [query]);

  // Generate dynamic response based on query
  let responseText = "I found some great options for you.";
  const q = query.toLowerCase();
  if (q.includes('chill') || q.includes('relax')) responseText = "Looking for something chill? I got you. ✨";
  if (q.includes('funny') || q.includes('comedy')) responseText = "Need a good laugh? These are guaranteed to hit. 😂";
  if (q.includes('scary') || q.includes('horror')) responseText = "Lock the doors... these are dangerously terrifying. 👻";
  if (q.includes('bored')) responseText = "Bored? Say no more. These are absolutely binge-worthy. 👀";

  return (
    <div className="ai-assistant-container">
      <div className="ai-chat-bubble">
        <div className="ai-avatar">🤖</div>
        <div className="ai-message">
          <h4 className="ai-name">Benflix AI</h4>
          {isTyping ? (
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          ) : (
            <p className="ai-text">{responseText}</p>
          )}
        </div>
      </div>

      {!isTyping && movies.length > 0 && (
        <div className="movies-grid ai-recommendations">
          {movies.slice(0, 6).map((movie, index) => {
            const uniqueKey = `ai-${movie.id}-${index}`;
            return <MovieCard key={uniqueKey} movie={movie} onClick={onMovieClick} />;
          })}
        </div>
      )}
    </div>
  );
}

AiAssistantUI.propTypes = {
  query: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string,
    profile_path: PropTypes.string,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    media_type: PropTypes.string,
  })).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};

export default AiAssistantUI;
