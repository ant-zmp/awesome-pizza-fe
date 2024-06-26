import "../styles/Navbar.css";
import React, {useState} from 'react';
import Logo from '../assets/ap_color_logo.svg';
import {Link} from 'react-router-dom';
import ReorderIcon from '@mui/icons-material/Reorder';

function Navbar() {
    const [openLinks, setOpenLinks] = useState(false);
    const toggleNavbar = () => setOpenLinks(!openLinks);
    return (
        <div className="navbar">
            <div className="leftSide" id={openLinks ? "open" : "close"}>
                <img src={Logo} alt={"Logo"}/>
                <div className={"hiddenLinks"}>
                    <Link to={"/"}> Home</Link>
                    <Link to={"/menu"}> Menu</Link>
                    <Link to={"/tracking"}> Order status</Link>
                </div>
            </div>
            <div className="rightSide">
                <Link to={"/"}> Home</Link>
                <Link to={"/menu"}> Menu</Link>
                <Link to={"/tracking"}> Order status</Link>
                <button onClick={toggleNavbar}>
                    <ReorderIcon />
                </button>
            </div>
        </div>
    );
}

export default Navbar;