import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import Menu from "./menu";
import Search from "./Search";

const Header = () => {
  return (
    <div className=" header bg-light">
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light 
      justify-content-between align-middle"
      >
        <Link to="/" className="header-logo">
          <h1
            className="navbar-brand text-uppercase p-0 m-0"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Social NetWork
          </h1>
        </Link>

        {/* Header Search */}
        <Search />

        {/* Header Menu */}
        <Menu />
      </nav>
    </div>
  );
};

export default Header;
