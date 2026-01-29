import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="nav">
            <nav className="nav-inner">
                <div className="brand">Student Hub</div>
                <NavLink className={({isActive}) => "link" + (isActive ? " active" : "")} to="/">Home</NavLink>
            </nav>
        </header>
    )
}