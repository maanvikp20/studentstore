import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-glow" />
        <div className="not-found-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or may have been moved.</p>
        <div className="not-found-actions">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
          <Link to="/" className="btn btn-secondary">
            Home
          </Link>
          <Link to="/inventory" className="btn btn-secondary">
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;