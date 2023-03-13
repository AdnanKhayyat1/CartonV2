import React, { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import NotesIcon from "@mui/icons-material/Notes";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import avatar from "./avatar.png";
import logo from "./logo.png";
const Sidebar = () => {
  const [currPages, setCurrPages] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [backIcon, setBackIcon] = useState(false);

  useEffect(() => {}, []);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDataOnStart();
  }, []);

  const fetchDataOnStart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("pages")
        .select()
        .eq("userID", user.id);
      if (error) throw error;
      if (data) {
        setCurrPages(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getExistingPage = (e) => {
    navigate(`/pages/${e.target.id}`);
  };
  return (
    <div className={`sideBar-wrapper ${isActive ? "active" : ""}`}>
      <div className={`navbar__item sidebar-logo ${isActive ? "active" : ""}`}>
        <img src={logo} alt="logo"/>
      </div>
      <div
        className="navbar__item navbar_switch"
        onClick={() => {
          setBackIcon(!backIcon);
          setIsActive(!isActive);
        }}
      >
        {backIcon ? (
          <ArrowBackRoundedIcon size={20} />
        ) : (
          <NotesIcon size={20} />
        )}
      </div>
      {isActive ? (
        <div className="side-profile">
          <Avatar src={avatar} alt="user profile" size={10} />
          <h3>Michella Kopti</h3>
        </div>
      ) : (
        <div className="side-profile collapsed">
          <Avatar src={avatar} alt="user profile" size={5} />
        </div>
      )}
      {isActive && (
        <div className="sideBar-section">
          <h3>Spaces</h3>
          {currPages.map((page, key) => {
            return (
              <div
                className="sideBar-item"
                id={page.id}
                key={key}
                onClick={getExistingPage}
              >
                <ArrowForwardIosRoundedIcon sx={{ fontSize: 13 }} />
                <span>{page.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
