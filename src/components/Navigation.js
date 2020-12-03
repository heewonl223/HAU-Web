import React from "react";
import {Link} from  "react-router-dom";

const Navigation = () => (<nav>
    <ul>
        <li>
            <Link to ="/profile"> Home </Link>
        </li>
        <li>
            <Link to ="/dailylog"> My Daily Log </Link>
        </li>
        <li>
            <Link to ="/diagnosis"> Diagnosis Result </Link>
        </li>
    </ul>
    </nav>
);
export default Navigation;