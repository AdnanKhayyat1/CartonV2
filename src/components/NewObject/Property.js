import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  Space,
  Input,
  Divider,
  Button,
  DatePicker,
} from "antd";

import {
  PlusOutlined,
  FontSizeOutlined,
  NumberOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ApiOutlined
} from "@ant-design/icons";

import "./property.css";
import { ObjectApi } from "../../api/objectApi";
let index = 0;
let ICON_STYLE = {
  color: "gray",
};
function Property({ propKey, propValue = "", propType, onUpdate, onDelete }) {

  const [items, setItems] = useState([])
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const [isSelectorLoading, setIsSelectorLoading] = useState(false);

  useEffect(() => {
    async function fetchAllObjects() {
      try{
        setIsSelectorLoading(true);
        const response = await ObjectApi.getObjects();
        setItems(response.map((object) => ({label: object.title, value: object._id})));
      } catch (error) {
        console.log(error);
      } finally {
        setIsSelectorLoading(false);
      }
    }

    fetchAllObjects();

    
  }, []);

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
        { value: "date", label: <CalendarOutlined style={ICON_STYLE} /> },
        { value: "relation", label: <ApiOutlined style={ICON_STYLE} /> },
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
      case "relation":
        return (
          <Select
            style={{ width: "calc(50% - 200px)" }}
            value={propValue}
            prefix-icon={<CalendarOutlined />}
            placeholder="Select item"
            bordered={false}
            disabled={isSelectorLoading}
            onChange={onSelectTypeChange}
            options={items.map((item) => ({ label: item.label, value: item.value }))}
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
