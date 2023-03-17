import React, { useState, useContext, useEffect } from "react";
import { Input, Divider, Button, Breadcrumb, Spin, Drawer, Modal } from "antd";
import {
  PlusCircleOutlined,
  HighlightOutlined,
  ExperimentOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import "./newObject.css";
import { COVER_IMAGE_URLS, DEFAULT_OBJECT_CONFIG } from "../../tools/constants";
import ContentGridV2 from "./ContentGridV2";
import styled from "styled-components";
import { StateContext } from "./ObjectContainer";
import { useQuery, useMutation } from "react-query";
import { ObjectApi } from "../../api/objectApi";

import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { devtools } from "zustand/middleware";
import Tags from "./Tags";
import Properties from "./Properties";
import Styler from "./Styler";
import CreateTemplateModal from "./CreateTemplateModal";
export const useObjectStore = create(
  devtools((set) => ({
    title: "",
    bio: "",
    properties: [],
    isTemplate: false,
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
    updateIsTemplate: (isTemplate) => set(() => ({ isTemplate: isTemplate })),
    updateProperties: (properties) => set(() => ({ properties: properties })),
    updateLeftColumn: (leftColumn) => set(() => ({ leftColumn: leftColumn })),
    updateRightColumn: (rightColumn) =>
      set(() => ({ rightColumn: rightColumn })),
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
  }))
);

useObjectStore.subscribe((state) =>
  updateObjectInServer({
    title: state.title,
    bio: state.bio,
    isTemplate: state.isTemplate,
    properties: state.properties,
    leftCol: state.leftColumn,
    rightCol: state.rightColumn,
    _id: "640d58cd5f5d6476f60aaa76",
  })
);
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

function NewObject({ id }) {
  const { isLoading, isError, data, isSuccess } = useQuery(["object", id], () =>
    ObjectApi.getObject(id)
  );
  const [showPicker, setShowPicker] = useState(false);
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
  const [isTemplate, setIsTemplate] = useObjectStore(
    (state) => [state.isTemplate, state.updateIsTemplate],
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
  const [openStyle, setOpenStyle] = useState(false);
  const [objConfig, setObjConfig] = useState(DEFAULT_OBJECT_CONFIG);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const showDrawer = () => {
    setOpenStyle(true);
  };

  const onClose = () => {
    setOpenStyle(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle(data.title);
      setBio(data.bio);
      setIsTemplate(data.isTemplate);
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
        data.properties !== properties ||
        data.isTemplate!== isTemplate 
      ) {
        mutation.mutate({
          ...data,
          title: title,
          bio: bio,
          isTemplate: isTemplate,
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
      <Drawer
        title="Style"
        placement="right"
        onClose={onClose}
        open={openStyle}
        forceRender
      >
        <Styler objConfig={objConfig} setObjConfig={setObjConfig} />
      </Drawer>
      <div
        className="object-app"
        style={{
          backgroundColor: objConfig[0].value,
          fontFamily: objConfig[1].value,
          textAlign: objConfig[2].value,
        }}
      >
        <CreateTemplateModal
          show={showTemplateModal}
          setShow={setShowTemplateModal}
          setIsTemplate={setIsTemplate}
        />
        <div className="header-main">
          <div className="icon-set">
            <Button
              className="header-btn"
              icon={<HighlightOutlined />}
              onClick={() => {
                setShowPicker(!showPicker);
                showDrawer();
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
            <Button
              className="header-btn"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setShowTemplateModal(true);
              }}
              type="text"
              disabled={isTemplate}
            >
              Save as Type
            </Button>
            <Button
              className="header-btn"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setIsTemplate(false);
              }}
              type="text"
              disabled={!isTemplate}
            >
              Remove Type
            </Button>
          </div>
          <div className="title-wrapper">
            <Input
              placeholder="New Page Title"
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
        <div className="header-section">{objConfig[3].value && <Tags />}</div>
        <div className="header-section">
          {objConfig[4].value && <Properties />}
        </div>
        <Divider />
        <ContentGridV2 />
      </div>
    </Wrapper>
  );
}

export default NewObject;
