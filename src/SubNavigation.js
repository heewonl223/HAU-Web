import React from "react";
import {Link} from  "react-router-dom";


const SubNavigation = () => (<nav>
    <div>
        <ul className="resultSort">
            <li><Link id = "Nav2" to ="/diagnosis">Dianosis Result</Link></li>
            <li><Link id = "Nav2" to ="/diagnosis2">Photo</Link></li>
            <li><Link id = "Nav2" to ="/diagnosis3">Prescription</Link></li>
        </ul>
    </div>
    </nav>

    
);
export default SubNavigation;