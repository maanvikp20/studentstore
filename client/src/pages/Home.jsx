import React from 'react';
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <div className="section banner">
        <img src="https://res.cloudinary.com/drg8btdmp/image/upload/v1770239503/Printer_ajkl0v.jpg" alt="" width="95%" height="400px"/>
      </div>
      <div className="section aboutUs">
        <h2>About Us</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, amet possimus exercitationem temporibus impedit obcaecati nulla expedita similique natus optio fugiat pariatur! Tempore, aliquid eius.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quas vitae quasi recusandae id delectus unde quod ut est, officia, asperiores ratione corporis suscipit cumque. Est dignissimos, odio vero quibusdam quod aliquid suscipit ducimus laborum beatae, quo neque atque ea.</p>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, repellendus.</p>
      </div>  
      <div className="section page-links">
        <div className="imageCard card">
          <img src="https://placehold.co/400" alt="" />
        </div>
        <div className="links card">
          <NavLink className="link" to="/inventory"> Visit Store </NavLink>
          <NavLink className="link" to="/custom-orders"> Custom Orders </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;