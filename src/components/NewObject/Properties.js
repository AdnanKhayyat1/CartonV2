import React, { useState } from "react";
import { Button, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Property from "./Property";
import styled from "styled-components";

const PropertyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`;
function Properties({ properties, setProperties }) {
  const addProperty = () => {
    setProperties([
      ...properties,
      {
        key: "",
        value: "",
        type: "text",
      },
    ]);
  };
  const updateProperty = (index, property) => {
    const newProperties = [...properties];
    newProperties[index] = property;
    setProperties(newProperties);
  };
  const deleteProperty = (index) => {
    const newProperties = [...properties];
    newProperties.splice(index, 1);
    setProperties(newProperties);
  };
  return (
    <PropertyWrapper>
      {properties.length > 0 && (
        <Divider
          children={"Properties"}
          orientation="left"
          orientationMargin="0"
        />
      )}
      {properties.map((property, index) => (
        <Property
          key={index}
          propKey={property.key}
          propValue={property.value}
          propType={property.type}
          onUpdate={(updatedProperty) => updateProperty(index, updatedProperty)}
          onDelete={() => deleteProperty(index)}
        />
      ))}

      <Button
        type="text"
        size="small"
        style={{
          color: "gray",
          paddingLeft: 0,
        }}
        icon={<PlusOutlined />}
        onClick={() => {
          addProperty();
        }}
      >
        Add Property
      </Button>
    </PropertyWrapper>
  );
}

export default Properties;
