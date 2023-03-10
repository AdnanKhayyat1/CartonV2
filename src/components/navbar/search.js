import React, { useState, useRef, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./search.css";

const Search = () => {
  const [showSearch, setShowSearch] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return (
    <>
      <div
        className="search-container"
        onClick={() => {
          setShowSearch(true);
        }}
      >
        <SearchRoundedIcon sx={{ fontSize: 20 }} />
        Search anything...
      </div>
      <div className={`dimmed-background ${showSearch ? "active" : ""}`} />

      {showSearch && (
        <div className={`search-full ${showSearch ? "active" : ""}`} ref={ref}>
          <input className="search-input" placeholder="Search Anything"></input>
          <div className="search-icon">
            <SearchRoundedIcon sx={{ fontSize: 30 }} />
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
