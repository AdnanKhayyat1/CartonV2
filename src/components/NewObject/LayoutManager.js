import React, { useState } from "react";
import { Space, List, Card, Tag, Button } from "antd";
import styled from "styled-components";
import { ReactComponent as CardIcon } from "./static/card.svg";
import { ReactComponent as DefaultIcon } from "./static/default.svg";
import { ReactComponent as FullIcon } from "./static/full.svg";
import { BorderOutlined, CheckCircleOutlined } from "@ant-design/icons";
const LAYOUT_TYPES = [
  {
    id: "card",
    title: "Card",
    bio: "Minimal layout for quick note-taking",
    icon: <CardIcon />,
  },
  {
    id: "default",
    title: "Page",
    bio: "Default layout with a full-screen view",
    icon: <DefaultIcon />,
  },
  {
    id: "full",
    title: "Full",
    bio: "Full-screen page with an expanded layout for complex things",
    icon: <FullIcon />,
  },
];
function LayoutManager({ layoutConfig, setLayoutConfig }) {
  const [selected, setSelected] = useState("default");

  return (
    <Option>
      <OptionPrefix>Page Layout:</OptionPrefix>
      <List
        dataSource={LAYOUT_TYPES}
        style={{ margin: "0 auto" }}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable={true}
              headStyle={{ textAlign: "left" }}
              bodyStyle={{
                textAlign: "left",
                width: 400,
                whiteSpace: "wrap",
              }}
              id={item.id}
              onClick={() => {
                setSelected(item.id);
              }}
              title={item.title}
              extra={
                selected === item.id ? (
                  <Tag
                    icon={<CheckCircleOutlined />}
                    style={{ textAlign: "center", marginRight: 0 }}
                    color="success"
                  >
                    Selected
                  </Tag>
                ) : (
                  <BorderOutlined />
                )
              }
            >
              <Card.Meta avatar={item.icon} description={item.bio}></Card.Meta>
            </Card>
          </List.Item>
        )}
      />
    </Option>
  );
}
const OptionPrefix = styled.div`
  font-weight: 600;
  font-size: 1.5em;
  width: 100%;
  text-align: left;
`;
const Option = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 10px;
  align-items: center;
`;

export default LayoutManager;
