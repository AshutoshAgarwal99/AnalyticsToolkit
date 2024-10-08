import React from 'react';
import {Link} from "react-router-dom";

function Tabs() {
    return (
        <div className="tab-options">
            <Link to="/exploration"><div className="tab"><p>Summury Data</p></div></Link>
            <Link to="/exploration/dataExploration"><div className="tab"><p>Data Exploration</p></div></Link>
        </div>
    )
}

export default Tabs
