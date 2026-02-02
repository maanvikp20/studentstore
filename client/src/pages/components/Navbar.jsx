import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="nav">
            <nav className="nav-inner">
                <div className="logo-section">
                    <div className="logo"></div>
                    <div className="brand">3D Print Store</div>
                </div>
                
                <div className="menu">
                    <div className="order-menu">
                        <NavLink className={({isActive}) => "link" + (isActive ? " active" : "")} to="/home">Home</NavLink>
                        <NavLink className={({isActive}) => "link" + (isActive ? " active" : "")} to="/orders">Orders</NavLink>
                        <NavLink className={({isActive}) => "link" + (isActive ? " active" : "")} to="/custom-orders">Custom Orders</NavLink>
                    </div>

                    <div className="personal-menu">
                        <NavLink className={({isActive}) => "link" + (isActive ? " active" : "")} to="/cart">Cart</NavLink>
                        <NavLink className={({isActive}) => "link" + (isActive ? " active" : "")} to="/login">Login</NavLink>
                    </div>
                    
                </div>
            </nav>
        </header>
    )
}