import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const FEATURES = [
  'High-quality PLA, PETG & specialty filaments',
  'Custom orders with your own STL files',
  'Fast turnaround from our student-run shop',
];

function Register({ onLogin }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authAPI.register(name, email, password);
      if (result.error)       setError(result.error);
      else if (result.data) { onLogin(result.data.user, result.data.token); navigate('/inventory'); }
    } catch {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="panel-brand">
          <div className="panel-logo">3</div>
          <span className="panel-brand-name">3D Print Store</span>
        </div>
        <div className="panel-copy">
          <h2 className="panel-quote">
            Join our community of<br />
            <span className="quote-accent">makers & creators.</span>
          </h2>
          <p className="panel-sub">
            Create an account to start ordering, track your prints, and submit custom designs.
          </p>
        </div>
        <div className="panel-features">
          {FEATURES.map((f, i) => (
            <div className="panel-feature" key={i}>
              <span className="feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-container">
        <div>
          <div className="auth-card">
            <div className="auth-logo-mobile">
              <div className="mobile-logo">3</div>
              <span className="mobile-brand">3D Print Store</span>
            </div>

            <h1>Create account</h1>
            <p className="auth-subtitle">Join the 3D printing community today.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  minLength="6"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;