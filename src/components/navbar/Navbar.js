import React, { useState } from "react";
import "./navbar.css";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  UpOutlined,
  ForkOutlined,
  MehOutlined,
} from "@ant-design/icons";
import { Button, Modal, Tooltip, Space, Typography } from "antd";
import Search from "./search";
import { useAuthStore } from "../stores/authStore";
import { shallow } from "zustand/shallow";
import styled from "styled-components";
const Navbar = () => {
  const [isSidebarActive, setIsSidebarActive] = useAuthStore(
    (state) => [state.isSidebarOpen, state.updateIsSidebarOpen],
    shallow
  );
  const [isGraphModal, setIsGraphModal] = useState(false);
  const handleSidebarClick = () => {
    setIsSidebarActive(!isSidebarActive);
  };
  const graphModalHandler = () => setIsGraphModal(!isGraphModal);
  return (
    <div className="nav-container">
      <div className="navbar__item">
        <Tooltip
          title={() => {
            return (
              <TooltipContent>
                <div style={{ marginRight: "2px" }}>Show navigation menu</div>
                <Keeb>
                  <UpOutlined style={{ strokeWidth: "10" }} />
                </Keeb>
                <Keeb>S</Keeb>
              </TooltipContent>
            );
          }}
        >
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
      <div className="navbar__item">
        <Tooltip
          title={() => {
            return (
              <TooltipContent>
                <div style={{ marginRight: "2px" }}>View graph</div>
                <Keeb>
                  <UpOutlined style={{ strokeWidth: "10" }} />
                </Keeb>
                <Keeb>G</Keeb>
              </TooltipContent>
            );
          }}
        >
          <Button
            icon={<ForkOutlined />}
            onClick={graphModalHandler}
            type="text"
          >
            View Graph
          </Button>
        </Tooltip>
        <Modal
          open={isGraphModal}
          onCancel={graphModalHandler}
          onOk={graphModalHandler}
        >
          <Space direction="vertical" align='center'>
            <MehOutlined style={{fontSize: '3em'}}/>
            <Typography.Title level={3} style={{marginTop: '2px'}}>Womp, Womp.</Typography.Title>
            <Typography.Text>This feature is not available yet. We're working hard to release it ASAP.</Typography.Text>
          </Space>
        </Modal>
      </div>
    </div>
  );
};
const TooltipContent = styled.div`
  display: flex;
  width: 100%;
`;
const Keeb = styled.div`
  border-radius: 5px;
  background: #b095ff;
  margin: 0px 4px;
  text-align: center;
  width: 22px;
  font-weight: bold;
  box-shadow: inset 0px -3px 0px rgba(0, 0, 0, 0.25);
`;

export default Navbar;
