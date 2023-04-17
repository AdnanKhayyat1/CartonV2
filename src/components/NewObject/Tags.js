import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";
import { useObjectStore } from "../stores/objectStore";
import { useTagStore } from "../stores/tagStore";
import { useAuthStore } from "../stores/authStore";
import { TagApi } from "../../api/tagApi";
import styled from "styled-components";
import { LinkOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { TAG_COLORS } from "../../tools/constants";
import { Button, Select, Tag, Spin, Input } from "antd";
import { useCellStore } from "../stores/cellStore";
import { ObjectApi } from "../../api/objectApi";
import { CellApi } from "../../api/cellApi";
import "./Tag.css";
function Tags() {
  const userID = useAuthStore((state) => state.userID);
  const [isLoading_, setIsLoading] = useState(false);

  const [tags, updateTags] = useTagStore(
    (state) => [state.tags, state.updateTags],
    shallow
  );
  const objectID = useObjectStore((state) => state._id);
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
    try {
      const res = await TagApi.createTag({
        name: newTagName,
        color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
        userID: userID,
      });
      const newTag = res.data;
      const updatedTags = [...objectTagIDs, newTag._id];
      const resObj = await ObjectApi.updateObject({
        _id: objectID,
        tags: updatedTags,
      });
      if (!resObj) throw new Error("Object not updated -- tags");
      updateTags([...tags, newTag]);
      tagOptionClickHandler(newTag._id);
    } catch (err) {
      console.log(err);
    }
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
  const tagOptionClickHandler = async (tagID) => {
    try {
      if (!objectTagIDs.includes(tagID)) {
        const newTags = [...objectTagIDs, tagID];
        const res = await ObjectApi.updateObject({
          _id: objectID,
          tags: newTags,
        });
        if (!res) throw new Error("Couldnt assign tag to object");
        updateObjectTagsIDs(newTags);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deselectTagHandler = async (index) => {
    try {
      const newTagIDs = [...objectTagIDs];
      newTagIDs.splice(index, 1);
      const res = await ObjectApi.updateObject({
        _id: objectID,
        tags: newTagIDs,
      });
      if (!res) throw new Error("Couldnt deselect tag from object");
      updateObjectTagsIDs(newTagIDs);
    } catch (err) {
      console.log(err);
    }
  };
  const [cellTags, setCellTags] = useCellStore(
    (state) => [state.tags, state.updateTags],
    shallow
  );

  const deleteTagEverywhere = async (tagID) => {
    try {
      setIsLoading(true);
      // delete tag from all cells (FE)
      if (cellTags.includes(tagID)) {
        const newCellTags = [...cellTags].filter((tag) => {
          return tag != tagID;
        });
        setCellTags(newCellTags);
      }

      // push changes to backend (BE)
      const resCells = await CellApi.deleteTagFromCells(tagID);
      if (!resCells.data) throw new Error("Cell POST call failed");
      // delete tag from current page (FE)
      if (objectTagIDs.includes(tagID)) {
        const updatedObjectTags = objectTags.filter((tag) => {
          return tag != tagID;
        });
        updateObjectTagsIDs(updatedObjectTags);
      }
      // delete tag from all pages (BE)
      const resObjects = await ObjectApi.removeTagFromObjects(tagID);
      if (resObjects.status !== 200) throw new Error("Object POST call failed");

      // delete tag (FE, BE)
      const resTags = await TagApi.deleteTagById(tagID);
      if (resTags.status !== 200) throw new Error("Tag DELETE call failed");
      var updatedTags = tags.filter((tag) => {
        return tag._id != tagID;
      });
      updateTags(updatedTags);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Wrapper>
      {isLoading_ ? (
        <Spin />
      ) : (
        <>
          <CollapsedView>
            <SelectedTags>
              {tags
                .filter((tag) => objectTagIDs.includes(tag._id))
                .map((tag, index) => {
                  return (
                    <Tag
                      key={index}
                      id={tag._id}
                      color={tag.color}
                      onClose={() => {
                        deselectTagHandler(index);
                      }}
                      closable
                      
                    >
                      {tag.name}
                    </Tag>
                  );
                })}
            </SelectedTags>
            <input
              placeholder="Add tag"
              className="tag-prompt"
              value={newTagName}
              onChange={_onTagInputChange}
              onFocus={() => setIsDropDownOpen(true)}
              onBlur={() => setIsDropDownOpen(false)}
              onKeyDown={_handleKeyDown}
            ></input>
          </CollapsedView>
          {isDropDownOpen && (
            <DropdownTags>
              <DropdownPrompt>
                Type to search tags or create a new one
              </DropdownPrompt>
              <TagOptions>
                {tags.map((tag, index) => {
                  return (
                    <TagOption>
                      <Tag
                        color={tag.color}
                        key={index}
                        id={tag._id}
                        onClick={() => tagOptionClickHandler(tag._id)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {tag.name}
                      </Tag>
                      <CloseCircleOutlined
                        onClick={() => deleteTagEverywhere(tag._id)}
                        style={{strokeWidth: '10px'}}
                      />
                    </TagOption>
                  );
                })}
              </TagOptions>
            </DropdownTags>
          )}
        </>
      )}
    </Wrapper>
  );
}
const DropdownPrompt = styled.div`
  font-size: 0.8rem;
  text-align: left;
  padding: 0.3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background-color: rgba(0, 0, 0, 0.04);
`;

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
  left: 0;
  top: 100%;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  max-height: 300px;
  border-radius: 8px;

  z-index: 10;

  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: calc(100% - 20px);

  overflow-y: auto;
  margin-top: 3px;
  padding-bottom: 5px;
`;
const TagOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100%-0.3rem);
  padding: 0.3rem;
  padding-bottom: 0;
`;

export default Tags;
