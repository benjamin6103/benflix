import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import '../css/Navbar.css';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo">🎬 Benflix</div>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Movies</a>
          <a href="#" className="nav-link">TV Shows</a>
          <a href="#" className="nav-link">Watchlist</a>
        </div>

        <div className="navbar-actions">
          <button className="search-btn">
            <Search size={20} />
          </button>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
