import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  Space,
  Input,
  InputNumber,
  Divider,
  Button,
  DatePicker,
} from "antd";
import {
  IconText,
  IconListNumbered,
  IconTableWithHeadings,
} from "@codexteam/icons";
import {
  PlusOutlined,
  FontSizeOutlined,
  NumberOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import "./property.css";
const TYPES = [
  {
    name: "Text",
    icon: IconText,
  },
  {
    name: "Date",
    icon: IconTableWithHeadings,
  },
];
const DEFAULT_INITIAL_DATA = () => {
  return {
    key: "",
    value: "",
    type: TYPES[0],
  };
};
let index = 0;
let ICON_STYLE = {
  color: "gray",
};
function Property({ propKey, propValue = "", propType, onUpdate, onDelete }) {
  const [items, setItems] = useState(["Not Started", "In Progress", "Done"]);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const onTypeChange = (t) => {
    onUpdate({
      key: propKey,
      value: "",
      type: t,
    });
  };

  const onKeyChange = (e) => {
    onUpdate({
      key: e.target.value,
      value: propValue,
      type: propType,
    });
  };

  const onValueChange = (e) => {
    console.log(e);
    onUpdate({
      key: propKey,
      value: e.target.value,
      type: propType,
    });
  };
  const onSelectTypeChange = (item) => {
    onUpdate({
      key: propKey,
      value: item,
      type: propType,
    });

  }
  const typeSelector = (
    <Select
      defaultValue="text"
      bordered={false}
      value={propType}
      onChange={(t) => onTypeChange(t)}
      options={[
        { value: "text", label: <FontSizeOutlined style={ICON_STYLE} /> },
        {
          value: "selector",
          label: <CheckCircleOutlined style={ICON_STYLE} />,
        },
        { value: "date", label: <CalendarOutlined style={ICON_STYLE} /> },
      ]}
    />
  );

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const renderValueInput = () => {
    switch (propType) {
      case "text":
        return (
          <Input
            style={{ width: "calc(50% - 200px)" }}
            value={propValue}
            bordered={false}
            onChange={onValueChange}
            placeholder="Enter value.."
          />
        );
      case "selector":
        return (
          <Select
            style={{ width: "calc(50% - 200px)" }}
            value={propValue}
            prefix-icon={<CalendarOutlined />}
            placeholder="Select item"
            bordered={false}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
            onChange={onSelectTypeChange}
            options={items.map((item) => ({ label: item, value: item }))}
          />
        );
      case "date":
        return (
          <DatePicker
            style={{ width: "calc(50% - 200px)" }}
            bordered={false}
            onChange={onValueChange}
          />
        );
    }
  };

  return (
    <div className="prop-container">
      <Space.Compact direction="horizontal" block={true} align="center">
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => {
            onDelete();
          }}
        />
        {typeSelector}

        <Input
          onChange={onKeyChange}
          value={propKey}
          placeholder="Property name"
          style={{
            width: "calc(50% - 200px)",
            color: "rgb(0,0,0,0.5)",
            opacity: "100%",
          }}
          bordered={false}
        />
        {renderValueInput()}
      </Space.Compact>
    </div>
  );
}

export default Property;
