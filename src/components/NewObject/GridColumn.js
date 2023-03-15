import React, { useEffect, useRef } from "react";
import { Dropdown, Button } from "antd";
import GridRow from "./GridRow";
import { CellApi } from "../../api/cellApi";
import { useQuery, useMutation } from "react-query";
import { useObjectStore } from "./NewObject";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import Editor from "../object/Editor";
import { devtools } from "zustand/middleware";
import { useCellStore } from "./ContentGridV2";
const items = [
  {
    label: "Block",
    key: "editor",
  },
  {
    label: "Object",
    key: "object",
  },
  {
    label: "Image",
    key: "image",
  },
];


function GridColumn({ cells, addRow }) {



  const onClick = async ({ key }) => {
    addRow();
  };


  return (
    <div className="grid-column">
      {cells.map((cell) => (
        <Editor id={cell._id} cell={cell} key={cell._id} />
      ))}
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

export default React.memo(GridColumn);
