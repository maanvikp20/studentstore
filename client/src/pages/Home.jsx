import React from 'react';

const Home = () => {
  return (
    <div className="home">
      {/* Banner Section */}
      <section className="banner">
        <h1>Your Banner Title Here</h1>
      </section>

      {/* About Us Section */}
      <section className="about">
        <h2>IT'S ABOUT US</h2>
        <p>
          Replace this text with your about us content. You can talk about your company, 
          mission, values, or anything else you want to share with your customers.
        </p>
      </section>

      {/* Carousel Section */}
      <section className="carousel">
        <p>Your product carousel will go here. Add your product slider/carousel component.</p>
      </section>

      {/* Two Column Section */}
      <section className="two-col">
        <div className="col-item large">
          <img src="https://via.placeholder.com/400x400" alt="Gallery" />
          <p>Replace with your image gallery</p>
        </div>
        <div className="col-right">
          <div className="col-item">
            <h3>Custom Orders</h3>
            <p>Add your custom orders content here</p>
          </div>
          <div className="col-item">
            <h3>Blank Page</h3>
            <p>Add any content you want here</p>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="best-sellers">
        <h3>Best Sellers</h3>
        <div className="products">
          <div className="product">
            <img src="https://via.placeholder.com/200x200" alt="Product 1" />
            <h4>Product Name 1</h4>
            <p>$99.99</p>
          </div>
          <div className="product">
            <img src="https://via.placeholder.com/200x200" alt="Product 2" />
            <h4>Product Name 2</h4>
            <p>$79.99</p>
          </div>
          <div className="product">
            <img src="https://via.placeholder.com/200x200" alt="Product 3" />
            <h4>Product Name 3</h4>
            <p>$89.99</p>
          </div>
          <div className="product">
            <img src="https://via.placeholder.com/200x200" alt="Product 4" />
            <h4>Product Name 4</h4>
            <p>$109.99</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;