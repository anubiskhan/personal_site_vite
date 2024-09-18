
// File: ./components/Home.tsx
import '../styles/Nav.css'
import fav from '/fav2.png'
import { NavLink } from 'react-router-dom';

const Nav = () => {
    return (
        <div className="topNav">
            <div>
                <NavLink to="/"><img src={fav} alt="" /></NavLink>
            </div>
            <div>
                <NavLink to="/me" className="navItem">Me</NavLink>
                <NavLink to="/things" className="navItem">Things</NavLink>
            </div>
        </div>
    );
}

export default Nav;