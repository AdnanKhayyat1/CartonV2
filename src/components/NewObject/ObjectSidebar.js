import React from "react";
import styled from "styled-components";
import { Button, Tooltip } from "antd";
import {
  HighlightOutlined,
  ExperimentOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  LayoutOutlined,
  UpOutlined,
  MacCommandOutlined,
} from "@ant-design/icons";
function ObjectSidebar({
  setIsTemplate,
  isTemplate,
  setShowTemplateModal,
  showTemplateModal,
}) {
  const showDrawer = () => {};

  return (
    <SideBarWrapper>
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
        placement="right"
      >
        <Button
          className="header-btn"
          icon={<HighlightOutlined />}
          onClick={() => {
            showDrawer();
          }}
          block
          type="text"
        />
      </Tooltip>

      <Tooltip
        title={() => {
          return (
            <TooltipContent>
              <div style={{ marginRight: "2px", whiteSpace: "nowrap" }}>
                Add integrations
              </div>
              <Keeb>
                <UpOutlined style={{ strokeWidth: "10" }} />{" "}
              </Keeb>
              <Keeb>S</Keeb>
            </TooltipContent>
          );
        }}
        placement="right"
      >
        <Button
          className="header-btn"
          icon={<ExperimentOutlined />}
          onClick={() => {}}
          block
          type="text"
        />
      </Tooltip>

      <Tooltip
        title={() => {
          return (
            <TooltipContent>
              <div style={{ marginRight: "2px", whiteSpace: "nowrap" }}>
                Save as template
              </div>
              <Keeb>
                <UpOutlined style={{ strokeWidth: "10" }} />{" "}
              </Keeb>
              <Keeb>S</Keeb>
            </TooltipContent>
          );
        }}
        placement="right"
      >
        {true ? (
          <Button
            className="header-btn"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setShowTemplateModal(true);
            }}
            block
            type="text"
            disabled={isTemplate}
          />
        ) : (
          <Button
            className="header-btn"
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setIsTemplate(false);
            }}
            block
            type="text"
            disabled={!isTemplate}
          />
        )}
      </Tooltip>
      <Tooltip
        title={() => {
          return (
            <TooltipContent>
              <div style={{ marginRight: "2px", whiteSpace: "nowrap" }}>
                Configure layout
              </div>
              <Keeb>
                <UpOutlined style={{ strokeWidth: "10" }} />{" "}
              </Keeb>
              <Keeb>S</Keeb>
            </TooltipContent>
          );
        }}
        placement="right"
      >

      <Button
        className="header-btn"
        icon={<LayoutOutlined />}
        onClick={() => {}}
        type="text"
        block
      />
      </Tooltip>
    </SideBarWrapper>
  );
}
const SideBarWrapper = styled.div`
  position: absolute;
  min-height: 100vh;
  max-width: fit-content;
  top: 0;
  right: 0;
  display: flex;
  width: fit-content;
  flex-direction: column;

  padding-top: 100px;

  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  border-width: 0px 0px 1px 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.07);
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
