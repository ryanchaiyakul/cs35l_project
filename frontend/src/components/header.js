import { Link } from "react-scroll";
import React from "react";
const Header = () => {
    return (
        <nav>
            <ul className="header" style={{ height: '7vh', marginTop:'0px', fontSize:'25px', color:"#1e3d59"}}>
                <li>
                    <Link
                        activeClass="active"
                        to="first"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500} 
                        
                        className="font-oxygen"
                    >
                    Recently Played

                    </Link>
                </li>
                <li>
                    <Link
                        activeClass="active"
                        to="second"
                        spy={true}
                        smooth={true}
                        offset={-62}
                        duration={500}
                        className="font-oxygen"

                    >
                        Favorite Artists
                    </Link>
                </li>
                <li>
                    <Link
                        activeClass="active"
                        to="third"
                        spy={true}
                        smooth={true}
                        offset={-62}
                        duration={500}
                        className="font-oxygen"
                    >
                        Favorite Tracks
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
export default Header;