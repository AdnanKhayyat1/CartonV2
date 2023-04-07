import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";
import { useObjectStore } from "../stores/objectStore";
import { useTagStore } from "../stores/tagStore";
import { useAuthStore } from "../stores/authStore";
import { TagApi } from "../../api/tagApi";
import { CellApi } from "../../api/cellApi";

import styled from "styled-components";
import {
  LinkOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { TAG_COLORS } from "../../tools/constants";
import { Button, Divider, Space, Spin, Tag } from "antd";
import { fontSize } from "@mui/system";
import { useMutation } from "react-query";
import { useCellStore } from "../stores/cellStore";
import { ObjectApi } from "../../api/objectApi";
function BlockTags({ cell }) {
  const userID = useAuthStore((state) => state.userID);

  const [tags, updateTags] = useTagStore(
    (state) => [state.tags, state.updateTags],
    shallow
  );
  const updateEntireCell = useCellStore((state) => state.updateEntireCellById);
  const [newTagName, setNewTagName] = useState("");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateCell = useMutation({
    mutationFn: CellApi.updateCell,
    onSuccess: (data) => {
      if (data.status === 200) {
        updateEntireCell(cell._id, data.data);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
    if (!cell.tags.includes(tagID)) {
      const updatedTagList = [...cell.tags, tagID];
      updateCell.mutate({
        ...cell,
        tags: updatedTagList,
      });
    }
  };
  const deselectTagHandler = (index) => {
    const newTagIDs = [...cell.tags];
    newTagIDs.splice(index, 1);
    updateCell.mutate({
      ...cell,
      tags: newTagIDs,
    });
  };
  const deleteTagsFromCellStore = useCellStore(
    (state) => state.deleteTagFromAllCells,
    shallow
  );
  const [objectTags, updateObjectTags] = useObjectStore((state) => [state.tags,state.updateTags], shallow);
  const deleteTagEverywhere = async (tagID) => {
    try {
      setIsLoading(true);
      // delete tag from all cells (FE)
      deleteTagsFromCellStore(tagID);
      // push changes to backend (BE)
      const resCells = await CellApi.deleteTagFromCells(tagID);
      if (!resCells.data) throw new Error("Cell POST call failed");
      // delete tag from current page (FE)
      if(objectTags.includes(tagID)){
        const updatedObjectTags = objectTags.filter((tag) => {
          return tag != tagID;
        });
        updateObjectTags(updatedObjectTags);
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

  return (
    <Wrapper>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Divider
            orientation="left"
            plain
            style={{ fontWeight: "600", margin: "8px 0px", marginBottom: '0px' }}
            orientationMargin={0}
          >
            <Button
              icon={
                isDropDownOpen ? (
                  <CloseCircleOutlined style={{ color: "red" }}/>
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
              .filter((tag) => cell.tags.includes(tag._id))
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
              <DropdownPrompt>Select a tag or create one</DropdownPrompt>

              <TagOptions>
                {tags.map((tag, index) => {
                  return (
                    <TagOption>
                      <Tag
                        color={tag.color}
                        key={index}
                        id={tag._id}
                        onClick={tagOptionClickHandler}
                        style={{ cursor: "pointer" }}
                      >
                        {tag.name}
                      </Tag>
                      <CloseCircleOutlined
                        onClick={() => deleteTagEverywhere(tag._id)}
                      />
                    </TagOption>
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
          )}{" "}
        </>
      )}
    </Wrapper>
  );
}
const TagOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const DropdownPrompt = styled.div`
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
  padding-top: 0px;

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
