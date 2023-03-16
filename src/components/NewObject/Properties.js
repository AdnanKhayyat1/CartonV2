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
function Properties({ showProps = true }) {
  const [properties, setProperties] = React.useState([]);
  const addProperty = () => {
    setProperties([
      ...properties,
      <Property key={properties.length} data={{}} />,
    ]);
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
      { properties}

      <Button
        type="text"
        size="small"
        style={{
          color: "gray",
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
