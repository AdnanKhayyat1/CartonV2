import React from "react";
import { Dropdown, Button } from "antd";
import GridRow from "./GridRow";
const items = [
  {
    label: "Block",
    key: "1",
  },
  {
    label: "Object",
    key: "2",
  },
  {
    label: "Image",
    key: "3",
  },
];
function GridColumn({ id, cells, addRow }) {
  const onClick = ({ key }) => {
    switch (key) {
      case "1":
        addRow(id);
        break;

      case "2":
        addRow(id, "object");
        break;

      case "3":
        addRow(id, "image");
        break;
    }
  };
  return (
    <div className="grid-column">
      {cells.map((cell) => (
        <GridRow key={cell.id} id={cell.id} cell={cell} />
      ))}
      <Dropdown menu={{ items, onClick }}>
        <Button
          id={id}
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

export default GridColumn;
