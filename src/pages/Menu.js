import React from 'react';
import { Link } from 'react-router-dom';

const Menu = (props) => {
    return (
        <div className="menu-component">
            <ul>
                <li><Link to="/affine">Affine Transform</Link></li>
            </ul>
        </div>
    )
}
export default Menu;