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
} from "@ant-design/icons";

import "./property.css";
const TYPES = [
  {
    name: "Text",
    icon: IconText,
  },
  {
    name: "Number",
    icon: IconListNumbered,
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
function Property({ data, onDataChange }) {
  const [type, setType] = useState(data.type ? data.type : "text");
  const [key, setKey] = useState(data.key ? data.key : "");
  const [value, setValue] = useState(data.value ? data.value : "");

  const [items, setItems] = useState(["Not Started", "In Progress", "Done"]);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const onTypeChange = (t) => {
    setValue("");
    setType(t);
  };
  const typeSelector = (
    <Select
      defaultValue="text"
      onChange={(t) => onTypeChange(t)}
      options={[
        { value: "text", label: <FontSizeOutlined /> },
        { value: "number", label: <NumberOutlined /> },
        { value: "selector", label: <CheckCircleOutlined /> },
        { value: "date", label: <CalendarOutlined /> },
      ]}
    />
  );
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        key: key,
        value: value,
        type: type,
      });
    }
  }, [type, value, key]);

  const onKeyChange = (e) => {
    setKey(e.target.value);
  };

  const onValueChange = (event) => {
    setValue(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const renderValueInput = () => {
    switch (type) {
      case "number":
        return (
          <InputNumber
            style={{ width: "calc(50% - 200px)" }}
            bordered={false}
            onChange={(v) => {
              onValueChange(v);
            }}
            placeholder="Enter number.."
          />
        );
      case "text":
        return (
          <Input
            style={{ width: "calc(50% - 200px)" }}
            bordered={false}
            onChange={(v) => {
              onValueChange(v);
            }}
            placeholder="Enter value.."
          />
        );
      case "selector":
        return (
          <Select
            style={{ width: "calc(50% - 200px)" }}
            placeholder="Select item"
            bordered={false}
            mode="multiple"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={name}
                    onChange={onValueChange}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
            onChange={(v) => {
              onValueChange(v);
            }}
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
        {typeSelector}

        <Input
          onChange={onKeyChange}
          placeholder="Property name"
          style={{ width: "calc(50% - 200px)", color:'rgb(0,0,0,0.5)', opacity:'100%' }}
          bordered={false}
        />
        {renderValueInput()}
      </Space.Compact>
    </div>
  );
}

export default Property;
