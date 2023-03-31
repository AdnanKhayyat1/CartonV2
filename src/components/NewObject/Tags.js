import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";
import { useObjectStore } from "../stores/objectStore";
import { useTagStore } from "../stores/tagStore";
import { useAuthStore } from "../stores/authStore";
import { TagApi } from "../../api/tagApi";
import styled from "styled-components";
import { LinkOutlined, DownOutlined } from "@ant-design/icons";
import { TAG_COLORS } from "../../tools/constants";
import { Button, Tag } from "antd";

function Tags() {
  const userID = useAuthStore((state) => state.userID);

  const [tags, updateTags] = useTagStore(
    (state) => [state.tags, state.updateTags],
    shallow
  );
  const [objectTagIDs, updateObjectTagsIDs] = useObjectStore(
    (state) => [state.tags, state.updateTags],
    shallow
  );
  const [objectTags, setObjectTags] = useState([]);
  const { isLoading, isError } = useQuery(
    "tags",
    () => TagApi.getTags(userID),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          const tags = res.data.tags;
          if (tags && tags.length > 0) {
            updateTags(tags);
          }
        }
      },
    }
  );
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
    if (!objectTagIDs.includes(tagID)) {
      updateObjectTagsIDs([...objectTagIDs, tagID]);
    }
  };
  const deselectTagHandler = (index) => {
    const newTagIDs = [...objectTagIDs];
    newTagIDs.splice(index, 1);
    updateObjectTagsIDs(newTagIDs);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Wrapper>
      <CollapsedView style={{
          backgroundColor: `${isDropDownOpen ? 'rgb(0, 0, 0,0.02)' : 'transparent'}`
        }}>
        <SelectedTags>
          {tags
            .filter((tag) => objectTagIDs.includes(tag._id))
            .map((tag, index) => {
              return (
                <Tag
                  key={index}
                  id={tag._id}
                  color={tag.color}
                  onClick={() => {
                    deselectTagHandler(index);
                  }}
                >
                  {tag.name}
                </Tag>
              );
            })}
        </SelectedTags>
        <Button
          icon={<LinkOutlined style={{ color: "gray" }} />}
          onClick={() => setIsDropDownOpen(!isDropDownOpen)}
          type="text"
          style={{
            marginLeft: '5px',
            padding: '4px 8px'
          }}
        >
        Add tag
        </Button>
        
      </CollapsedView>
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

`
const CollapsedView = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;
const Wrapper = styled.div`
  position: relative;
`;
const SelectedTags = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
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
  background-color: white;
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
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.5);
`;

export default Tags;
