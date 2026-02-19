import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { testimonialsAPI } from '../utils/api';
import { FaStar, FaChevronLeft, FaChevronRight, FaArrowRight, FaCube, FaPrint, FaMagic } from 'react-icons/fa';

const FALLBACK_TESTIMONIALS = [
  { _id: '1', name: 'Alex R.', rating: 5, message: 'Absolutely stunning quality. The detail on my custom print was beyond what I expected — totally blew me away.' },
  { _id: '2', name: 'Mia T.', rating: 5, message: 'Fast turnaround and the filament color matched perfectly. Will definitely be ordering again soon.' },
  { _id: '3', name: 'Jordan K.', rating: 4, message: 'Great communication throughout the process. They nailed the specs on my custom enclosure.' },
  { _id: '4', name: 'Sam L.', rating: 5, message: 'Ordered a custom figurine and it came out incredible. The layer lines are barely visible — pro-level work.' },
  { _id: '5', name: 'Casey W.', rating: 5, message: 'Best 3D print shop I\'ve found. Prices are fair and the quality is consistently excellent.' },
];

const FEATURES = [
  { icon: <FaCube />, title: 'Precision Printing', desc: 'Layer-by-layer accuracy down to 0.1mm for flawless results every time.' },
  { icon: <FaPrint />, title: 'Wide Material Range', desc: 'PLA, PETG, ABS, TPU, and specialty filaments for any application.' },
  { icon: <FaMagic />, title: 'Custom Designs', desc: 'Upload your STL or work with us to bring your vision to life.' },
];

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(s => (
        <FaStar key={s} className={s <= rating ? 'star filled' : 'star'} />
      ))}
    </div>
  );
}

function TestimonialCarousel({ testimonials }) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const intervalRef = useRef(null);
  const count = testimonials.length;

  const go = (dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setActive(prev => dir === 'next' ? (prev + 1) % count : (prev - 1 + count) % count);
      setAnimating(false);
    }, 350);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => go('next'), 5000);
    return () => clearInterval(intervalRef.current);
  }, [count, animating]);

  const resetInterval = (dir) => {
    clearInterval(intervalRef.current);
    go(dir);
    intervalRef.current = setInterval(() => go('next'), 5000);
  };

  const prev = (active - 1 + count) % count;
  const next = (active + 1) % count;

  return (
    <div className="testimonial-carousel">
      <button className="carousel-arrow left" onClick={() => resetInterval('prev')} aria-label="Previous">
        <FaChevronLeft />
      </button>

      <div className="carousel-track">
        <div className={`carousel-card side left-card`} key={`prev-${prev}`}>
          <p className="testimonial-text">"{testimonials[prev].message}"</p>
          <div className="testimonial-author">
            <div className="author-avatar">{testimonials[prev].name.charAt(0)}</div>
            <span>{testimonials[prev].name}</span>
          </div>
        </div>

        <div className={`carousel-card center-card ${animating ? `exit-${direction}` : 'enter'}`} key={`active-${active}`}>
          <StarRating rating={testimonials[active].rating} />
          <p className="testimonial-text">"{testimonials[active].message}"</p>
          <div className="testimonial-author">
            <div className="author-avatar">{testimonials[active].name.charAt(0)}</div>
            <span>{testimonials[active].name}</span>
          </div>
        </div>

        <div className={`carousel-card side right-card`} key={`next-${next}`}>
          <p className="testimonial-text">"{testimonials[next].message}"</p>
          <div className="testimonial-author">
            <div className="author-avatar">{testimonials[next].name.charAt(0)}</div>
            <span>{testimonials[next].name}</span>
          </div>
        </div>
      </div>

      <button className="carousel-arrow right" onClick={() => resetInterval('next')} aria-label="Next">
        <FaChevronRight />
      </button>

      <div className="carousel-dots">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === active ? 'active' : ''}`}
            onClick={() => { clearInterval(intervalRef.current); setActive(i); }}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const Home = () => {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    testimonialsAPI.getAll()
      .then(res => { if (res?.length > 0) setTestimonials(res); })
      .catch(() => {});
  }, []);

  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">West-MEC 3D Print Store</div>
          <h1 className="hero-headline">
            Bring Your Ideas<br />
            <span className="hero-accent">Into Reality</span>
          </h1>
          <p className="hero-sub">High-quality 3D printed products and fully custom printing services — designed, printed, and delivered.</p>
          <div className="hero-actions">
            <NavLink className="btn btn-primary hero-btn" to="/inventory">
              Shop Now <FaArrowRight />
            </NavLink>
            <NavLink className="btn btn-ghost hero-btn" to="/custom-orders">
              Custom Order
            </NavLink>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img
            src="https://res.cloudinary.com/drg8btdmp/image/upload/v1770239503/Printer_ajkl0v.jpg"
            alt="3D Printer"
            className="hero-img"
          />
          <div className="hero-img-glow" />
        </div>
      </section>

      <section className="features-strip">
        {FEATURES.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="about-section">
        <div className="about-image-wrap">
          <img
            src="https://res.cloudinary.com/dnhjp6xda/image/upload/v1770846193/ball_owqo3y.jpg"
            alt="Sample Print"
            className="about-img"
          />
        </div>
        <div className="about-content">
          <div className="section-label">About Us</div>
          <h2 className="about-heading">Crafted With Precision, Built for You</h2>
          <p>We're a student-run 3D print shop at West-MEC North East Campus passionate about turning ideas into physical objects. Whether you need a one-off prototype or a batch of custom parts, we've got you covered.</p>
          <p>Every print is carefully monitored, post-processed, and quality-checked before it ships. We use a wide range of filaments and settings to match your exact requirements.</p>
          <NavLink className="btn btn-primary" to="/custom-orders">
            Start a Custom Order <FaArrowRight />
          </NavLink>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-label">Reviews</div>
        <h2 className="testimonials-heading">What Our Customers Say</h2>
        {testimonials.length > 0 && <TestimonialCarousel testimonials={testimonials} />}
      </section>

      <section className="cta-section">
        <h2>Ready to Print Something Amazing?</h2>
        <p>Browse our in-stock products or submit a fully custom order today.</p>
        <div className="cta-actions">
          <NavLink className="btn btn-primary" to="/inventory">Visit the Store</NavLink>
          <NavLink className="btn btn-ghost" to="/custom-orders">Custom Orders</NavLink>
        </div>
      </section>

    </div>
  );
};

export default Home;