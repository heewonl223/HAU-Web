import React from "react";
import {Link} from  "react-router-dom";

const Navigation = () => (<nav>
    <ul>
        <li class="navi">
            <Link id="Title" to ="/profile"> Home </Link>
        </li>
        <li class="navi">
            <Link to ="/dailylog"> My Daily Log </Link>
        </li>
        <li class="navi">
            <Link to ="/diagnosis"> Diagnosis Result </Link>
        </li>
    </ul>
    </nav>
);
export default Navigation;