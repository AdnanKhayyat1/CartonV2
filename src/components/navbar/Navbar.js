import React, { useState } from "react";
import "./navbar.css";

import Search from "./search";

const Navbar = ({ onSideBarClick }) => {
  const [backIcon, setBackIcon] = useState(false);
  return (
    <div className="nav-container">
      <div className="navbar__item">
        <Search />
      </div>

    </div>
  );
};

export default Navbar;
