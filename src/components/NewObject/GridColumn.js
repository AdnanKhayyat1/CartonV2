import React, { useEffect, useRef } from "react";
import { Dropdown, Button, Popover } from "antd";
import GridRow from "./GridRow";
import { CellApi } from "../../api/cellApi";
import { useQuery, useMutation } from "react-query";
import { useObjectStore } from "./NewObject";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import Editor from "../object/Editor";
import { devtools } from "zustand/middleware";
import { useCellStore } from "./ContentGridV2";
import ImageBlock from "./ImageBlock";
import EmbeddedObject from "./EmbeddedObject";
import styled from "styled-components";
const items = [
  {
    label: "Section",
    key: "editor",
  },
  // {
  //   label: "Object",
  //   key: "object",
  // },
  // {
  //   label: "Image",
  //   key: "image",
  // },
];

function GridColumn({ cells, addRow }) {
  const onClick = async ({ key }) => {
    addRow(key);
  };
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  return (
    <div className="grid-column" style={{ maxWidth: "45vw" }}>
      {cells.map((cell) => {
       return <GridRow key={cell._id} cell={cell} id={cell._id} />;
      })}
      <Dropdown menu={{ items, onClick }}>
        <Button
          block
          style={{ marginTop: "10px", maxWidth: "50%" }}
          onClick={(e) => {
            e.preventDefault();
          }}

        >
          Add Row
        </Button>
      </Dropdown>
    </div>
  );
}
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

export default React.memo(GridColumn, (prevProps, nextProps) => {
  return prevProps.cells === nextProps.cells;
});
