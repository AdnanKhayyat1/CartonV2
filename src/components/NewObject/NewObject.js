import React, { useState, useContext, useEffect } from "react";
import { Input, Divider, Button, Breadcrumb, Spin, Drawer, Modal } from "antd";
import {

  EditOutlined,
} from "@ant-design/icons";
import "./newObject.css";
import EmojiPicker, { Emoji, EmojiStyle } from "emoji-picker-react";

import { DEFAULT_OBJECT_CONFIG } from "../../tools/constants";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ObjectApi } from "../../api/objectApi";

import { shallow } from "zustand/shallow";
import Tags from "./Tags";
import Properties from "./Properties";

import useObjectStore from "../stores/objectStore";
import ObjectSidebar from "./ObjectSidebar";
import { notification } from "antd";
import { useParams } from "react-router-dom";
import EditorWrapper from "./EditorWrapper";

const Wrapper = styled.div`
  border-radius: 10px;
  max-width: fit-content;
  margin: 10px auto;
  height: 90vh;
`;
const AbnormalWrapper = styled.div`
  position: absolute;
  top: 50vh;
  left: 50%;
`;

function NewObject() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoading, isError, data, isSuccess } = useQuery(
    ["object", id],
    () => ObjectApi.getObject(id),
    {
      refetchOnMount: "always",
    }
  );
  const [title, setTitle] = useObjectStore(
    (state) => [state.title, state.updateTitle],
    shallow
  );
  const setId = useObjectStore((state) => state.updateId, shallow);
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
  const [editorID, setEditorID] = useObjectStore((state) => [state.editorID, state.updateEditorID], shallow)
  const [pageIcon, setPageIcon] = useObjectStore((state) => [state.icon, state.updateIcon], shallow)
  const [viewType, setViewType] = useObjectStore((state) => [state.viewType, state.updateViewType], shallow)

  const [openStyle, setOpenStyle] = useState(false);
  const [objConfig, setObjConfig] = useState(DEFAULT_OBJECT_CONFIG);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const mutation = useMutation(
    (updatedObject) => ObjectApi.updateObject(updatedObject),
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["object", id] }),
    }
  );

  const onCloseStyle = () => {
    setOpenStyle(false);
  };

  const openNotificationWithIcon = (type, message = "") => {
    if (type === "success") {
      api["success"]({
        message: "Succesfully saved as template",
        description:
          "You can now create new pages like this one. Templates preserve layout, tags, style, and property keys.",
      });
    } else if (type === "info") {
      api["info"]({
        message: "Template deleted",
        description: "Your page is no longer a template.",
      });
    } else if (type === "error") {
      api["error"]({
        message: "Error",
        description: message,
      });
    }
  };

  const onEmojiClick = (emojiData, event) => {
    setPageIcon(emojiData.unified);
    setShowIconPicker(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setId(data._id);
      setTitle(data.title);
      setBio(data.bio);
      setTags(data.tags);
      setIsTemplate(data.isTemplate);
      setProperties(data.properties);
      setEditorID(data.editorID);
      setPageIcon(data.icon);
      setViewType(data.viewType);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (
      data &&
      (data.title !== title ||
        data.bio !== bio ||
        data.properties !== properties ||
        data.isTemplate !== isTemplate ||
        data.tags !== tags ||
        data.icon !== pageIcon ||
        data.viewType !== viewType)
    ) {
      mutation.mutate({
        ...data,
        title: title,
        bio: bio,
        tags: tags,
        isTemplate: isTemplate,
        properties: properties,
        icon: pageIcon,
        viewType: viewType,
      });
    }
  }, [title, bio, properties, isTemplate, pageIcon, viewType]);

  if (isLoading) {
    return (
      <AbnormalWrapper>
        <Spin />
      </AbnormalWrapper>
    );
  }
  if (isError) {
    return (
      <AbnormalWrapper>
        <h1>Error</h1>
      </AbnormalWrapper>
    );
  }
  return (
    <Wrapper>
      {contextHolder}
      <ObjectSidebar
        setIsTemplate={setIsTemplate}
        triggerNotification={openNotificationWithIcon}
        isTemplate={isTemplate}
      />
      <Drawer
        title="Style"
        placement="right"
        onClose={onCloseStyle}
        open={openStyle}
        forceRender
      ></Drawer>

      <div
        className="object-app"
        style={{
          backgroundColor: objConfig[0].value,
          fontFamily: objConfig[1].value,
          textAlign: objConfig[2].value,
        }}
      >
        <div className="header-main">
          <div className="page-icon">
            {pageIcon ? (
              <Emoji
                unified={pageIcon.toLowerCase()}
                emojiStyle={EmojiStyle.APPLE}
                size={22}
              />
            ) : null}
            <div
              className="edit-overlay"
              onClick={() => {
                setShowIconPicker(!showIconPicker);
              }}
            >
              <EditOutlined />
              <span>Edit</span>
            </div>
            {showIconPicker && (
              <div className="icon-picker">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  lazyLoadEmojis
                />
              </div>
            )}
          </div>

          <div className="title-wrapper">
            {/* <EmojiPicker/> */}
            <Input
              placeholder="New Page Title"
              value={title}
              bordered={false}
              style={{
                fontSize: 50,
                fontWeight: 600,
                maxWidth: "100%",
                whiteSpace: "break-spaces",
              }}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onKeyDown={(e) => {}}
              maxLength="20"
            />
          </div>
        </div>

        <div className="header-section">
          <Tags />
        </div>
        <div className="header-section">
          <Input
            placeholder="Add bio"
            style={{ color: "grey" }}
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
        {editorID && <EditorWrapper editorID={editorID}/>}
        
      </div>
    </Wrapper>
  );
}

export default NewObject;
