import React, { useState, useContext, useEffect } from "react";
import { Input, Divider, Button, Breadcrumb, Spin, Drawer, Modal } from "antd";
import {
  PlusCircleOutlined,
  HighlightOutlined,
  ExperimentOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./newObject.css";
import { COVER_IMAGE_URLS, DEFAULT_OBJECT_CONFIG } from "../../tools/constants";
import ContentGridV2 from "./ContentGridV2";
import styled from "styled-components";
import { StateContext } from "./ObjectContainer";
import { useQuery, useMutation } from "react-query";
import { ObjectApi } from "../../api/objectApi";

import { shallow } from "zustand/shallow";

import Tags from "./Tags";
import Properties from "./Properties";
import Styler from "./Styler";
import CreateTemplateModal from "./CreateTemplateModal";
import useObjectStore from "../stores/objectStore";
import { useAuthStore } from "../stores/authStore";
import ObjectSidebar from "./ObjectSidebar";


const Wrapper = styled.div`
  border-radius: 10px;
  max-width: fit-content;
  margin: 10px auto;
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
  const setId = useObjectStore((state) => state.updateId, shallow);
  const mutation = useMutation((updatedObject) =>
    ObjectApi.updateObject(updatedObject)
  );
  const [bio, setBio] = useObjectStore(
    (state) => [state.bio, state.updateBio],
    shallow
  );
  const [tags, setTags] = useObjectStore(
    (state) => [state.tags, state.updateTags],
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
      setId(data._id);
      setTitle(data.title);
      setBio(data.bio);
      setTags(data.tags);
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
        data.isTemplate !== isTemplate ||
        data.tags !== tags
      ) {
        mutation.mutate({
          ...data,
          title: title,
          bio: bio,
          tags: tags,
          isTemplate: isTemplate,
          properties: properties,
        });
      }
      // Send Axios request here
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [title, bio, properties, isTemplate]);

  if (isLoading) {
    return <Spin />;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <Wrapper>
      <ObjectSidebar/>
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
        <div className="header-section" style={{ marginLeft: "5px" }}>
          <Tags />
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
          {objConfig[4].value && (
            <Properties properties={properties} setProperties={setProperties} />
          )}
        </div>
        <Divider />
        <ContentGridV2 />
      </div>
    </Wrapper>
  );
}

export default NewObject;
