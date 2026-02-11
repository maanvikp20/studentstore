import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-column">
            <h3 className="footer-title">3D Print Store</h3>
            <p className="footer-description">
              Your one-stop shop for high-quality 3D printed products and custom printing services.
            </p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Quick Links</h4>
            <ul className="footer-links">
              <li><NavLink to="/home">Home</NavLink></li>
              <li><NavLink to="/inventory">Shop</NavLink></li>
              <li><NavLink to="/custom-orders">Custom Orders</NavLink></li>
              <li><NavLink to="/profile">My Profile</NavLink></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FaEnvelope />
                <span>support@3dprintstore.com</span>
              </li>
              <li>
                <FaPhone />
                <span>(555) 123-4567</span>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>West-MEC North East Campus</span>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Business Hours</h4>
            <ul className="footer-hours">
              <li>
                <span>Monday - Friday</span>
                <span>8:00 AM - 5:00 PM</span>
              </li>
              <li>
                <span>Saturday</span>
                <span>10:00 AM - 3:00 PM</span>
              </li>
              <li>
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} 3D Print Store. All rights reserved. Designed by West-MEC North East Campus.
          </p>
        </div>
      </div>
    </footer>
  );
}