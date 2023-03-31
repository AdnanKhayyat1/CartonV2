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
function BlockSettings({
  cell,
  setPinColor,
  collapsibleHandler,
  isCollapsible,
}) {
  const [blockTitle, setBlockTitle] = useState("");

  const blockDeleteHandler = () => {};
  return (
    <SettingsWrapper>
      <Input
        placeholder="Block title"
        value={blockTitle}
        bordered={false}
        style={{
          paddingLeft: 0,
        }}
      />
      <BlockTags cell={cell} />
      <Space align="center" style={{ margin: "10px 0" }}>
        <Tooltip title="Delete" placement="bottom">
          <Button icon={<DeleteOutlined />} onClick={blockDeleteHandler} />
        </Tooltip>
        <Tooltip title="Change pin color" placement="top">
          <Select
            onChange={(value, option) => {
              setPinColor(value);
            }}
            placeholder="Select pin color"
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
