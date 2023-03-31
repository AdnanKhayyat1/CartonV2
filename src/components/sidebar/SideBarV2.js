import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthStore } from "../stores/authStore";
import { shallow } from "zustand/shallow";
import { Button, Divider } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import SidebarSection from "./SidebarSection";
import { useQuery } from "react-query";
import { ObjectApi } from "../../api/objectApi";
import { TagApi } from "../../api/tagApi";
import './SideBarV2.css';

const btnStyle = { textAlign: "left" };

function SideBarV2({ userID }) {
  const [objects, setObjects] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const isSidebarActive = useAuthStore(
    (state) => state.isSidebarOpen,
    shallow
  );
  const { isLoading, isError } = useQuery(
    "objectsSidebar",
    () => ObjectApi.getObjects(userID),
    {
      onSuccess: (data) => {
        if (data) {
          renderObjectItems(data);
        }
      },
      refetchOnMount: "always",
    }
  );
  const getTags = useQuery("tagsSidebar", () => TagApi.getTags(userID), {
    onSuccess: (data) => {
      if (data) {
        renderTagItems(data.data.tags);
      }
    },
    refetchOnMount: "always",
  });
  const renderObjectItems = (data) => {
    const list = data.map((object) => {
      return (
        <ObjectListItem
          key={object._id}
          onClick={(e) => {
            navigate(`/newobject/${object._id}`);
          }}
        >
          <CaretRightOutlined />
          {object.title}
        </ObjectListItem>
      );
    });
    setObjects(list);
  };
  const renderTagItems = (data) => {
    console.log(data);
    const list = data.map((tag) => {
      return (
        <ObjectListItem key={tag._id}>
          <TagColorIcon style={{ backgroundColor: tag.color }} />
          {tag.name}
        </ObjectListItem>
      );
    });
    setTags(list);
  };

  if (isLoading || getTags.isLoading) {
    return <div>Loading</div>;
  }
  if (isError || getTags.isError) {
    return <div>Error</div>;
  }
  return (
    <>

        <div className={`SideBarWrapper ${isSidebarActive? 'active' : 'exiting'}`}>
          <WelcomeMessage>Your Workspace</WelcomeMessage>
          <SideBarHeader>
            <Button
              icon={<HomeOutlined />}
              style={btnStyle}
              type="text"
              block
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              icon={<SettingOutlined />}
              style={btnStyle}
              type="text"
              block
            >
              Settings
            </Button>
            <Button icon={<UserOutlined />} style={btnStyle} type="text" block>
              Users
            </Button>
          </SideBarHeader>
          <Divider style={{ margin: "12px 0" }} />
          <SidebarSection title={"PINNED"} children={[]} />
          <SidebarSection title={"PAGES"} children={objects} />
          <SidebarSection title={"TAGS"} children={tags} />
        </div>
      
    </>
  );
}
const SideBarHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const WelcomeMessage = styled.h5`
  color: gray;
  margin-bottom: 0.5em;
`;
const ObjectListItem = styled.div`
  &:hover {
    font-weight: bold;
  }
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5em;
  margin: 0.5em;
  text-wrap: break-word;
`;
const TagColorIcon = styled.div`
  width: 10px;
  height: 10px;
  opacity: 0.8;
  border: 1px solid;
  border-radius: 3px;
`;
export default SideBarV2;
