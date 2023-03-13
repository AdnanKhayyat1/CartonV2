import React, { useState, useContext, useEffect } from "react";
import { Input, Divider, Button, Breadcrumb, Spin } from "antd";
import {
  PlusCircleOutlined,
  HighlightOutlined,
  ExperimentOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./newObject.css";
import { COVER_IMAGE_URLS } from "../../tools/constants";
import Property from "../../tools/Property";
import ContentGridV2 from "./ContentGridV2";
import styled from "styled-components";
import { StateContext } from "./DashboardNew";
import { useQuery, useMutation } from "react-query";
import { ObjectApi } from "../../api/objectApi";

import { create } from "zustand";
import { shallow } from "zustand/shallow";

export const useObjectStore = create((set) => ({
  title: "",
  bio: "",
  properties: [],
  leftColumn: {
    showColumn: true,
    cellIDs: [],
  },
  rightColumn: {
    showColumn: false,
    cellsIDs: [],
  },
  updateTitle: (title) => set(() => ({ title: title })),
  updateBio: (bio) => set(() => ({ bio: bio })),
  updateProperties: (properties) => set(() => ({ properties: properties })),
  updateLeftColumn: (leftColumn) => set(() => ({ leftColumn: leftColumn })),
  updateRightColumn: (rightColumn) => set(() => ({ rightColumn: rightColumn })),
  addCellToLeftColumn: (id) =>
    set((state) => ({
      leftColumn: {
        ...state.leftColumn,
        cellIDs: [...state.leftColumn.cellIDs, id],
      },
    })),
  addCellToRightColumn: (id) =>
    set((state) => ({
      rightColumn: {
        ...state.rightColumn,
        cellIDs: [...state.rightColumn.cellIDs, id],
      },
    })),
}));

useObjectStore.subscribe((state) => updateObjectInServer({
  title: state.title,
  bio: state.bio,
  properties: state.properties,
  leftCol: state.leftColumn,
  rightCol: state.rightColumn,
  _id: '640d58cd5f5d6476f60aaa76'

}));
const updateObjectInServer = (data) => {
  return ObjectApi.updateObject(data);
};

const updateCellInServer = (data) => {
  return ObjectApi.updateCell(data);
};
const Nav = styled.div`
  height: 20px;
  padding-left: 0px;
  border-radius: 10px 10px 0px 0px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 10px;
  align-items: center;
`;
const Wrapper = styled.div`
  border-radius: 10px;
  margin: 10px;
`;

function NewObject({}) {
  const id = "640d58cd5f5d6476f60aaa76";
  const { isLoading, isError, data, isSuccess } = useQuery(
    ["object", "640d58cd5f5d6476f60aaa76"],
    () => ObjectApi.getObject(id)
  );
  const [showIconSet, setShowIconSet] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [coverIndex, setCoverIndex] = useState(-1);
  const { splitScreen, setSplitScreen } = useContext(StateContext);
  const [title, setTitle] = useObjectStore(
    (state) => [state.title, state.updateTitle],
    shallow
  );
  const mutation = useMutation((updatedObject) =>
    ObjectApi.updateObject(updatedObject)
  );
  const [bio, setBio] = useObjectStore(
    (state) => [state.bio, state.updateBio],
    shallow
  );
  const [properties, setProperties] = useObjectStore(
    (state) => [state.properties, state.updateProperties],
    shallow
  );
  const updateLeftColumn = useObjectStore(
    (state) => state.updateLeftColumn,
    shallow
  );
  const updateRightColumn = useObjectStore(
    (state) => state.updateRightColumn,
    shallow
  );
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setTitle(data.title);
      setBio(data.bio);
      setProperties(data.properties);
      updateLeftColumn(data.leftCol);
      updateRightColumn(data.rightCol);
    }
  }, [isSuccess]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (
        data.title !== title ||
        data.bio !== bio ||
        data.properties !== properties
      ) {
        mutation.mutate({
          ...data,
          title: title,
          bio: bio,
          properties: properties,
        });
      }
      // Send Axios request here
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [title, bio, properties]);

  const addProperty = () => {
    // setProperties([...data.properties, <Property data={{}} />]);
  };
  if (isLoading) {
    return <Spin />;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <Wrapper>
      {splitScreen && (
        <Nav>
          <ArrowLeftOutlined
            className="navbar-icon"
            onClick={() => setSplitScreen(false)}
          />

          <Breadcrumb
            style={{
              margin: "0 auto",
            }}
            items={[
              {
                href: "",
                title: <HomeOutlined />,
              },
              {
                href: "",
                title: <span>{title ? title : "Parent"}</span>,
              },
              {
                title: "New Object",
              },
            ]}
          />
        </Nav>
      )}
      <div
        className="object-app"
        style={{
          backgroundColor:
            coverIndex >= 0 ? COVER_IMAGE_URLS[coverIndex] : "white",
        }}
      >
        <div className="header-main" onMouseLeave={() => setShowIconSet(false)}>
          {title !== "" && (showIconSet || showPicker) && (
            <div className="icon-set">
              {showPicker && (
                <div className="color-picker-cover">
                  {COVER_IMAGE_URLS.map((color, index) => {
                    return (
                      <div
                        className="color-icon"
                        style={{
                          backgroundColor: color,
                        }}
                        value={index}
                        key={index}
                        onClick={() => {
                          setCoverIndex(index);
                          setShowPicker(!showPicker);
                        }}
                      ></div>
                    );
                  })}
                </div>
              )}
              <Button
                className="header-btn"
                icon={<HighlightOutlined />}
                onClick={() => {
                  setShowPicker(!showPicker);
                }}
                type="text"
              >
                Theme
              </Button>
              <Button
                className="header-btn"
                icon={<ExperimentOutlined />}
                onClick={() => {}}
                type="text"
              >
                Logic
              </Button>
            </div>
          )}
          <Input
            placeholder="New Page Title"
            onMouseEnter={() => setShowIconSet(true)}
            value={title}
            bordered={false}
            style={{ fontSize: 50, fontWeight: 600, maxWidth: "30vw" }}
            onBlur={() => setIsTyping(false)}
            onFocus={() => setIsTyping(true)}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            onKeyDown={(e) => {}}
          />
        </div>
        <div className="header-section">
          <Input
            placeholder="Add bio"
            style={{ color: "grey" }}
            onBlur={() => setIsTyping(false)}
            onFocus={() => setIsTyping(true)}
            value={bio}
            bordered={false}
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        </div>
        <div className="header-section">
          <Divider orientation="left" orientationMargin="0">
            Properties
          </Divider>
          {properties}
          <Button
            icon={<PlusCircleOutlined />}
            type="dashed"
            onClick={() => {
              addProperty();
            }}
          >
            Add property
          </Button>
        </div>
        <Divider />
        <ContentGridV2 />
      </div>
    </Wrapper>
  );
}

export default NewObject;
