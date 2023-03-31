import React, { useState } from "react";
import "./navbar.css";
import { DoubleLeftOutlined, DoubleRightOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Search from "./search";
import { useAuthStore } from "../stores/authStore";
import { shallow } from "zustand/shallow";
import styled from "styled-components";
const Navbar = () => {
  const [isSidebarActive, setIsSidebarActive] = useAuthStore(
    (state) => [state.isSidebarOpen, state.updateIsSidebarOpen],
    shallow
  );
  const handleSidebarClick = () => {
    setIsSidebarActive(!isSidebarActive);
  };
  return (
    <div className="nav-container">
      <div className="navbar__item">
        <Tooltip title={() => {
          return (
            <TooltipContent>
            <div style={{marginRight: '2px'}}>Show navigation menu</div>
            <Keeb><UpOutlined /></Keeb>
            <Keeb>S</Keeb>
            </TooltipContent>
          )
        }}>
          <Button
            icon={
              isSidebarActive ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
            }
            onClick={handleSidebarClick}
            type="text"
          />
        </Tooltip>
      </div>
      <div className="navbar__item">
        <Search />
      </div>
      <div className="navbar__item"></div>
    </div>
  );
};
const TooltipContent = styled.div`
  display: flex;
  width: 100%;
  
`
const Keeb = styled.div`
  border-radius: 5px;
  background: #B095FF;
  margin: 0px 4px;
  text-align: center;
  width: 22px;
  box-shadow: inset 0px -3px 0px rgba(0, 0, 0, 0.25);


`

export default Navbar;
