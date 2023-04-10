import React, { useState, useRef, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./search.css";
import { Button, Spin } from "antd";
import styled from "styled-components";
import { SearchApi } from "../../api/searchApi";
import { Momentum } from "@uiball/loaders";
import { useAuthStore } from "../stores/authStore";

const Search = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const ref = useRef(null);
  const userID = useAuthStore((state) => state.userID)

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

  const search = async () => {
    try {
      setIsLoading(true);
      if (!!prompt) {
        const response = await SearchApi.getSearch(prompt, userID).then((data) => {
        if (!data) throw new Error("Search failed");
        setResult(data.answer);
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleValueChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };
  const renderSearchBox = () => {
    if (isLoading) {
      return <Momentum size={40} speed={1.1} color="#9E90F7" />;
    }
    else if(result) {
      return <ResultText>
        {result}
      </ResultText>
    } else {
      return;
    }
  };
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
        <SearchWrapper ref={ref}>
          <div className="search-full">
            <input
              className="search-input"
              placeholder="✨ Search Anything"
              onKeyPress={handleKeyDown}
              value={prompt}
              onChange={handleValueChange}
              disabled={isLoading}
            />

            <Button
              className="search-icon"
              icon={<SearchRoundedIcon sx={{ fontSize: 30 }} />}
              type="ghost"
              onClick={search}
            />
          </div>
          <div className={`search-box ${isLoading ? 'loading' : ''}`}>{renderSearchBox()}</div>
        </SearchWrapper>
      )}
    </>
  );
};
const ResultText = styled.div`
  margin-top: 2em;
  color: white;
  text-align: left;
  overflow-wrap: break-word;
  max-width: 100%;
  
`
const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  width: 40vw;
  min-width: 300px;
  height: 400px;

  box-shadow: rgba(0, 0, 0, 0.16) 0px 2px 4px 0px inset;
  background: linear-gradient(180deg, #060a11 0%, #0f0417 100%);
  outline: none;
  border-color: #221130;
  box-shadow: 0 0 10px #221130;

  border-radius: 10px;
  overflow: hidden;
`;

export default Search;
