import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";
import { useObjectStore } from "../stores/objectStore";
import { useTagStore } from "../stores/tagStore";
import { useAuthStore } from "../stores/authStore";
import { TagApi } from "../../api/tagApi";
import styled from "styled-components";
import {
  LinkOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { TAG_COLORS } from "../../tools/constants";
import { Button, Divider, Space, Tag } from "antd";
import { fontSize } from "@mui/system";

function BlockTags({ cell }) {
  const userID = useAuthStore((state) => state.userID);

  const [tags, updateTags] = useTagStore(
    (state) => [state.tags, state.updateTags],
    shallow
  );
  const [cellTagIDs, updateCellTagIds] = useState(cell.tags);
  const [newTagName, setNewTagName] = useState("");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const createTag = async () => {
    const res = await TagApi.createTag({
      name: newTagName,
      color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
      userID: userID,
    });
    const newTag = res.data;
    updateTags([...tags, newTag]);
  };
  const _onTagInputChange = (event) => {
    setNewTagName(event.target.value);
  };
  const _handleKeyDown = (event) => {
    if (event.key == "Enter") {
      createTag();
      setNewTagName("");
    }
  };

  // check if tag id exists in tag list of object
  // if false, add tag to object tags
  const tagOptionClickHandler = (event) => {
    const tagID = event.target.id;
    if (!cellTagIDs.includes(tagID)) {
      updateCellTagIds([...cellTagIDs, tagID]);
    }
  };
  const deselectTagHandler = (index) => {
    const newTagIDs = [...cellTagIDs];
    newTagIDs.splice(index, 1);
    updateCellTagIds(newTagIDs);
  };

  return (
    <Wrapper>
      <Divider orientation="left" plain style={{ fontWeight: "600", margin: '8px 0px' }} orientationMargin={0}>
        <Button
          icon={
            isDropDownOpen ? (
              <CloseCircleOutlined />
            ) : (
              <PlusOutlined style={{ color: "gray" }} />
            )
          }
          onClick={() => setIsDropDownOpen(!isDropDownOpen)}
          type="text"
          style={{
            padding: "0px 7px",
            fontWeight: 600,
          }}
        >
          Tags
        </Button>
      </Divider>
      <Space size={[4, 4]} wrap>
        {tags
          .filter((tag) => cellTagIDs.includes(tag._id))
          .map((tag, index) => {
            return (
              <Tag
                key={index}
                id={tag._id}
                style={{ cursor: "pointer" }}
                color={tag.color}
                onClick={(e) => {
                  e.preventDefault();
                  deselectTagHandler(index);
                }}
              >
                {tag.name}
              </Tag>
            );
          })}
      </Space>
      {isDropDownOpen && (
        <DropdownTags>
          <DropdownPrompt>
            Select a tag or create one
          </DropdownPrompt>

          <TagOptions>
            {tags.map((tag, index) => {
              return (
                <Tag
                  color={tag.color}
                  key={index}
                  id={tag._id}
                  onClick={tagOptionClickHandler}
                >
                  {tag.name}
                </Tag>
              );
            })}
          </TagOptions>
          <CreateTag
            placeholder="New tag name"
            value={newTagName}
            onKeyDown={_handleKeyDown}
            onChange={_onTagInputChange}
          ></CreateTag>
        </DropdownTags>
      )}
    </Wrapper>
  );
}
const DropdownPrompt = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  padding-right: 5px;
  font-weight: 600;
`;
const Wrapper = styled.div`
  position: relative;
  width: 300px;
`;
const TagOptions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-x: hidden;
  gap: 5px;
`;
const DropdownTags = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #f5f7fa;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  max-height: 300px;
  padding: 10px;
  border-radius: 0px 0px 8px 8px;

  z-index: 10;

  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);

  overflow-y: auto;
`;
const CreateTag = styled.input`
  width: 95%;
  height: 30px;
  right: 0;
  top: 100%;
  border-radius: 0 0 5px 5px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.5);
  background-color: rgb(255, 255, 255, 0.5);
`;
export default BlockTags;
