import React from 'react'

const Home = () => {
  return (
    <div className="home-container">

      {/* Hero/Banner Section - Large top section */}
      <section className="hero-banner">
        <div className="banner-content">
          <h1>Main Headline</h1>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit...</p>
        </div>
      </section>

      {/* Category Cards - Grid of 4 cards below banner */}
      <section className="category-grid">
        <div className="category-card">Card 1</div>
        <div className="category-card">Card 2</div>
        <div className="category-card">Card 3</div>
        <div className="category-card">Card 4</div>
      </section>
      

      {/* Featured Content Section - Full width with text */}
      <section className="featured-content">
        <h2>Featured Section Title</h2>
        <p>Description text for this section...</p>
      </section>

      {/* Product Grid - 2 columns */}
      <section className="product-grid-two-col">
        <div className="product-card-large">Product 1</div>
        <div className="product-card-large">Product 2</div>
      </section>

      {/* Testimonials/Info Section */}
      <section className="testimonials-section">
        <div className="testimonial-content">
          <p>Customer testimonial or important information...</p>
        </div>
      </section>

      {/* Best Sellers Grid - 3 columns */}
      <section className="best-sellers">
        <h2>Best Sellers</h2>
        <div className="product-grid-three-col">
          <div className="product-card">Product 1</div>
          <div className="product-card">Product 2</div>
          <div className="product-card">Product 3</div>
        </div>
      </section>

      {/* Another Product Grid - 2x2 layout */}
      <section className="product-grid-four">
        <div className="product-card">Item 1</div>
        <div className="product-card">Item 2</div>
        <div className="product-card">Item 3</div>
        <div className="product-card">Item 4</div>
      </section>

      {/* Email Signup Section */}
      <section className="newsletter-section">
        <div className="newsletter-icon">📧</div>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          {/* Footer links and info */}
        </div>
      </footer>
    </div>
  )
}

export default Home