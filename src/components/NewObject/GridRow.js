import React from "react";
import Editor from "../object/Editor";
import EmbeddedObject from "./EmbeddedObject";
import styled from "styled-components";
import { Popover } from "antd";
import ImageBlock from "./ImageBlock";

const CellTimeline = styled.div`
  flex: 0.5;
  position: relative;
`;
const SideLine = styled.div`
  height: 100%;
  width: 3px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 0 auto;
`;
const StartPin = styled.div`
  height: 5px;
  width: 5px;
  margin: 0 auto;
  margin-top: 10px;

  border-radius: 10px;
  background-color: white;
  border: 4px solid cornflowerblue;
  border-width: 4px;
  border-style: solid;
  cursor: pointer;
`;

function GridRow({ id, cell }) {
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
  return (
    <div className="grid-cell">
      <CellTimeline>
        <Popover content={content} title="Title" trigger="click">
          <StartPin
            style={{
              borderColor: cell.type === "editor" ? "cornflowerblue" : "green",
            }}
          />
        </Popover>
        <SideLine></SideLine>
      </CellTimeline>
      {cell.type === "editor" ? (
        <Editor editorID={`editorjs-${id}`} />
      ) : cell.type === "image" ? (
        <ImageBlock />
      ) : (
        <EmbeddedObject />
      )}
    </div>
  );
}

export default GridRow;
