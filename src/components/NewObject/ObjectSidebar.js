import React, { useState } from "react";
import styled from "styled-components";
import { Button, Tooltip } from "antd";
import {
  HighlightOutlined,
  ExperimentOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  LayoutOutlined,
  ArrowsAltOutlined,
  UpOutlined,
  MacCommandOutlined,
} from "@ant-design/icons";
import Styler from "./Styler";
import "./ObjectSidebar.css";
import LayoutManager from "./LayoutManager";
function ObjectSidebar({ setIsTemplate, isTemplate, triggerNotification }) {
  const [selectedOption, setSelectedOption] = useState("");
  const showDrawer = () => {};

  const renderExpandedSidebar = () => {
    if (selectedOption === "STYLE") {
      return <Styler />;
    } else if (selectedOption === "LAYOUT") {
      return <LayoutManager />;
    } else {
      return;
    }
  };
  const templateHandler = () => {
    setSelectedOption("");
    if (isTemplate) {
      setIsTemplate(false);
      triggerNotification("info");
    } else if (!isTemplate) {
      setIsTemplate(true);
      triggerNotification("success");
    }
  };

  return (
    <SidebarWrapper>
      <CollapsedSidebar>
        <Tooltip
          title={() => {
            return (
              <TooltipContent>
                <div style={{ marginRight: "2px", whiteSpace: "nowrap" }}>
                  Edit appearance
                </div>
                <Keeb>
                  <MacCommandOutlined />
                </Keeb>
                <Keeb>S</Keeb>
              </TooltipContent>
            );
          }}

          placement="left"
        >
          <Button
            type="text"
            className="header-btn"
            icon={<HighlightOutlined />}
            onClick={() => {
              if (selectedOption === "STYLE") {
                setSelectedOption("");
              } else {
                setSelectedOption("STYLE");
              }
            }}
            block
            disabled
           
          />
        </Tooltip>

        <Tooltip
          title={() => {
            return (
              <TooltipContent>
                <div style={{ marginRight: "2px", whiteSpace: "nowrap" }}>
                  {!isTemplate ? "Save as template" : "Delete template"}
                </div>
              </TooltipContent>
            );
          }}
          placement="left"
        >
          <Button
            className="header-btn"
            icon={isTemplate ? <CloseCircleOutlined /> : <PlusCircleOutlined />}
            onClick={templateHandler}
            block
            type="text"
          />
        </Tooltip>
        <Tooltip
          title={() => {
            return (
              <TooltipContent>
                <div style={{ marginRight: "2px", whiteSpace: "nowrap" }}>
                  Configure layout
                </div>
              </TooltipContent>
            );
          }}
          placement="left"
        >
          <Button
            className="header-btn"
            icon={<LayoutOutlined />}
            onClick={() => {
              if (selectedOption === "LAYOUT") {
                setSelectedOption("");
              } else {
                setSelectedOption("LAYOUT");
              }
            }}
            type="text"
            block
          />
        </Tooltip>
        <Tooltip
          title={() => {
            return (
              <TooltipContent>
                <div style={{ marginRight: "2px", whiteSpace: "nowrap" }}>
                  Expand writing space
                </div>
              </TooltipContent>
            );
          }}
          placement="left"
        >
          <Button
            className="header-btn"
            icon={<ArrowsAltOutlined />}
            
            type="text"
            block
            disabled
          />
        </Tooltip>
      </CollapsedSidebar>
      <div
        className={`expanded-sidebar ${
          !!selectedOption ? "active-side-bar" : "hidden-side-bar"
        }`}
      >
        {renderExpandedSidebar()}
      </div>
    </SidebarWrapper>
  );
}
const SidebarWrapper = styled.div`
  position: absolute;
  min-height: 100vh;
  max-width: fit-content;
  top: 0;
  right: 0;
  display: flex;
`;
const CollapsedSidebar = styled.div`
  display: flex;
  width: fit-content;
  flex-direction: column;
  background-color: white;

  padding-top: 100px;

  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  border-width: 0px 0px 1px 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.07);
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
`;

const TooltipContent = styled.div`
  display: flex;
  width: 100%;
`;
const Keeb = styled.div`
  border-radius: 5px;
  background: #b095ff;
  margin: 0px 4px;
  text-align: center;
  min-width: 24px;

  box-shadow: inset 0px -3px 0px rgba(0, 0, 0, 0.25);
`;

export default ObjectSidebar;
