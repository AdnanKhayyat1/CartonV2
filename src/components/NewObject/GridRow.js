import React, { useState } from "react";
import Editor from "../object/Editor";
import EmbeddedObject from "./EmbeddedObject";
import styled from "styled-components";
import { Collapse, Popover } from "antd";
import ImageBlock from "./ImageBlock";
import {
  CaretRightOutlined,
  CaretDownOutlined,
  CloseCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import BlockSettings from "./BlockSettings";
import "./GridRow.css";

const CellTimeline = styled.div`
  flex: 0.5;
  position: relative;
`;
const SideLine = styled.div`
  height: 100%;
  width: 3px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 0 auto;
`;
const StartPin = styled.div`
  height: 5px;
  width: 5px;
  margin: 0 auto;
  margin-top: 10px;

  border-radius: 10px;
  background-color: white;
  border: 4px solid cornflowerblue;
  border-width: 4px;
  border-style: solid;
  cursor: pointer;
`;

function GridRow({ id, cell }) {
  const [currentCell, setCurrentCell] = useState(null);
  const [pinColor, setPinColor] = useState("cornflowerblue");
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [openToggle, setOpenToggle] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  useEffect(() => {
    setCurrentCell(renderCell());
  }, []);
  const renderCell = () => {
    if (cell.mode === "editor") {
      return <Editor id={cell._id} cell={cell} key={cell._id} />;
    } else if (cell.mode === "image") {
      return <ImageBlock id={cell._id} cell={cell} key={cell._id} />;
    } else {
      return <EmbeddedObject id={cell._id} cell={cell} key={cell._id} />;
    }
  };
  const collapsibleHandler = () => {
    setIsCollapsible(!isCollapsible);
    setOpenToggle(true);
  };
  const handleOpenChange = (newOpen) => {
    setOpenPopover(newOpen);
  };
  const closePopover = () => {
    setOpenPopover(false);
  };
  return (
    <div className="grid-cell">
      <CellTimeline>
        <Popover
          content={
            <BlockSettings
              cell={cell}
              setPinColor={setPinColor}
              collapsibleHandler={collapsibleHandler}
              isCollapsible={isCollapsible}
              closePopover={closePopover}
            />
          }
          title={
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgb(0,0,0,0.1)",
              }}
            >
              <span>
                <SettingOutlined color="gray" /> Block Settings
              </span>
              <CloseCircleOutlined
                onClick={closePopover}
                style={{ opacity: "0.8" }}
              />
            </div>
          }
          trigger="click"
          open={openPopover}
          onOpenChange={handleOpenChange}
          placement="left"
        >
          <StartPin
            style={{
              borderColor: cell.mode === "editor" ? pinColor : "green",
            }}
          />
        </Popover>
        <SideLine></SideLine>
      </CellTimeline>
      <RowContent>
        <ToggleHeader
          onClick={() => setOpenToggle(!openToggle)}
          disabled={!isCollapsible}
        >
          <div>
            {openToggle ? <CaretDownOutlined /> : <CaretRightOutlined />}
          </div>
          <div className={`toggleTitle ${openToggle ? "active" : "exiting"}`}>
            Block title
          </div>
        </ToggleHeader>
        {openToggle && currentCell}
      </RowContent>
    </div>
  );
}
const ToggleHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 9px;
  cursor: pointer;
  background-color: transparent;
  border: none;
`;
const RowContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default GridRow;
