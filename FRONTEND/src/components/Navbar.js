import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css'; // Import the CSS file

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block">
              <ul className="flex space-x-4">
                <li>
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className="nav-link" activeClassName="nav-link-active">
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/features" className="nav-link">
                    Features
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pricing" className="nav-link">
                    Pricing
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup" className="nav-link">
                    Sign Up
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;