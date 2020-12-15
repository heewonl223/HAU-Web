import React from "react";
import {Link} from  "react-router-dom";
import Logo from 'components/reallogo.png';


const Navigation = () => (<nav>
    <ul>
        <li>
            <Link id = "Nav_img" to ="/profile"> 
            <img
            src={Logo}
            height='90'/> </Link>
        </li>
        <li>
            <Link id = "Title" to ="/profile"> &nbsp; How About U? </Link>
        </li>
        <li>
            <Link id = "Nav1" to ="/dailylog"> My Daily Log </Link>
        </li>
        <li>
            <Link id = "Nav1" to ="/diagnosis"> Diagnosis Result </Link>
        </li>
        <li>   
            <Link id = "Nav1" to ="/search"> Search </Link>
        </li>
    </ul>
    </nav>

    
);
export default Navigation;