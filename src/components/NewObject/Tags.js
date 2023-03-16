import React, { useState } from "react";
import { Button, Select, Divider, Space, Input, Tag } from "antd";
import { LinkOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";

const TAG_COLORS = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];
const TagWrapper = styled.div`
  text-align: left;
  min-width: 40vw;
  margin-left: 10px;
`;

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
function Tags() {
  const inputRef = React.useRef(null);
  const [newTagName, setnewTagName] = useState("");
  const [possibleItems, setPossibleItems] = useState([
    {
      key: "1",
      label: "Studying",
      value: TAG_COLORS[0],
    },
  ]);

  const addItem = (e) => {
    const newItem = {
      label: newTagName,
      value: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
    };
    setPossibleItems([...possibleItems, newItem]);
    setnewTagName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  return (
    <TagWrapper>
      <LinkOutlined style={{ color: "gray" }} />
      <Select
        style={{ minWidth: 300 }}
        placeholder="Select tag"
        bordered={false}
        mode="tags"
        tagRender={tagRender}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <Space style={{ padding: "0 8px 4px" }}>
              <Input
                placeholder="Tag name.."
                ref={inputRef}
                value={newTagName}
                onChange={(e) => {
                  setnewTagName(e.target.value);
                }}
              />
              <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                Tag
              </Button>
            </Space>
          </>
        )}
        options={possibleItems.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
      ></Select>
    </TagWrapper>
  );
}

export default Tags;
