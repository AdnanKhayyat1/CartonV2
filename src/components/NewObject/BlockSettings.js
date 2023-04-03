import React, { useEffect, useState } from "react";
import { Button, Input, Space, Select, Tooltip } from "antd";
import {
  DeleteOutlined,
  BgColorsOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import BlockTags from "./BlockTags";
import styled from "styled-components";
import { COVER_IMAGE_URLS } from "../../tools/constants";
import { useCellStore } from "../stores/cellStore";
import { useObjectStore } from "../stores/objectStore";
import { CellApi } from "../../api/cellApi";
import { shallow } from "zustand/shallow";
function BlockSettings({ cell, collapsibleHandler, isCollapsible }) {
  const [blockTitle, setBlockTitle] = useState("");
  const updateEntireCellById = useCellStore(
    (state) => state.updateEntireCellById
  );

  const [cells, updateCells] = useCellStore(
    (state) => [state.cells, state.updateCells],
    shallow
  );
  const [leftColumn, updateLeftColumn, rightColumn, updateRightColumn] =
    useObjectStore(
      (state) => [
        state.leftColumn,
        state.updateLeftColumn,
        state.rightColumn,
        state.updateRightColumn,
      ],
      shallow
    );
  const changeColorHandler = async (value) => {
    updateEntireCellById(cell._id, {...cell, color: value});
    const res = await CellApi.updateCell({...cell, color: value});
  }
  const blockDeleteHandler = async () => {
    try {
      if (leftColumn.cellIDs.includes(cell._id)) {
        const updatedLeftCells = leftColumn.cellIDs.filter(
          (c) => c !== cell._id
        );
        console.log(updatedLeftCells);
        updateLeftColumn({
          ...leftColumn,
          cellIDs: updatedLeftCells,
        });
      }
      if (rightColumn.cellIDs.includes(cell._id)) {
        const updatedRightCells = rightColumn.cellIDs.filter(
          (c) => c !== cell._id
        );
        updateRightColumn({
          ...rightColumn,
          cellIDs: updatedRightCells,
        });
      }
      const newCells = cells.filter((c) => c._id !== cell._id);
      updateCells(newCells);

      const res = await CellApi.removeCell([cell._id]);
      if (!res.acknowledged) {
        throw new Error("Couldn't delete cells");
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  const blockTitleHandler = async () => {
    updateEntireCellById(cell._id, {...cell, title: blockTitle});
    const res = await CellApi.updateCell({...cell, title: blockTitle});


  }
  return (
    <SettingsWrapper>
      <Space.Compact>

      <Input
        placeholder="Block title"
        value={blockTitle}
        onChange={(e) => setBlockTitle(e.target.value)}
        />
      <Button onClick={blockTitleHandler}>
        Save
      </Button>
        </Space.Compact>
      <BlockTags cell={cell} />
      <Space align="center" style={{ margin: "10px 0" }}>
        <Tooltip title="Delete" placement="bottom">
          <Button icon={<DeleteOutlined />} onClick={blockDeleteHandler} />
        </Tooltip>
        <Tooltip title="Change pin color" placement="top">
          <Select
            onChange={(value, option) => {
              changeColorHandler(value);
            }}
            placeholder="Select pin color"
            value={cell.color}
          >
            {[...COVER_IMAGE_URLS, "cornflowerblue"].map((color, index) => {
              return (
                <Select.Option key={index} value={color}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="color-icon"
                      style={{
                        backgroundColor: color,
                        height: "10px",
                        width: "10px",
                        border: "1px solid rgb(0,0,0,0.3)",
                        borderRadius: "2px",
                      }}
                    ></div>
                    {color}
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </Tooltip>
        <Tooltip
          title={
            isCollapsible ? "Switch to fixed view" : "Switch to toggle view"
          }
          placement="bottom"
        >
          <Button
            icon={isCollapsible ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
            onClick={(e) => {
              e.preventDefault();
              collapsibleHandler();
            }}
          />
        </Tooltip>
      </Space>
    </SettingsWrapper>
  );
}
const SettingsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default BlockSettings;
