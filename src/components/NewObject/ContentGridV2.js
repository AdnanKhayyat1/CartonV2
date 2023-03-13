import React, { useState } from "react";
import { Button } from "antd";

import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "./newObject.css";
import GridColumn from "./GridColumn";
import { shallow } from "zustand/shallow";
import { useObjectStore } from "./NewObject";
const initialCols = [
  {
    id: "column-1",
    cells: [
      {
        id: "cell-1",
        type: "editor",
        order: 1,
      },
    ],
    showCol: true,
  },
  {
    id: "column-2",
    cells: [
      {
        id: "cell-2",
        type: "editor",
        order: 1,
      },
    ],
    showCol: false,
  },
];

function ContentGridV2() {
  const [leftColumn, setLeftColumn] = useObjectStore(
    (state) => [state.leftColumn, state.updateLeftColumn],
    
  );
  const [rightColumn, setRightColumn] = useObjectStore(
    (state) => [state.rightColumn, state.updateRightColumn],
    
  );
  const updateLeftCells = useObjectStore((state) => state.addCellToLeftColumn)
  const updateRightCells = useObjectStore((state) => state.addCellToRightColumn)
  const [data, setData] = useState([initialCols]);
  const [numCells, setNumCells] = useState(2);
  const bothColsOpen = () => {
    return leftColumn.showCol && rightColumn.showCol;
  };

  const showColumn = () => {

    setLeftColumn({ ...leftColumn, showColumn: true });
    setRightColumn({ ...rightColumn, showColumn: true });
  };
  const hideLeftCol = () => {
    setLeftColumn({ ...leftColumn, showColumn: false });
  };
  const hideRightCol = () => {
    setRightColumn({ ...rightColumn, showColumn: false });
  };

  const getColumnById = (id) => {
    return data.find((col) => col.id === id);
  };
  const getColumnIndexById = (id) => {
    return data.findIndex((col) => col.id === id);
  };

  const addRow = (id, type) => {
    const currentColumn = getColumnById(id);
    const newRow = {
      id: `cell-${numCells + 1}`,
      type: type || "editor",
      order:
        currentColumn.cells.length === 0
          ? 0
          : currentColumn.cells[currentColumn.cells.length - 1].order + 1,
    };
    setNumCells(numCells + 1);
    const updatedCurrentColumn = {
      ...currentColumn,
      cells: [...currentColumn.cells, newRow],
    };
    const columnIndex = getColumnIndexById(id);
    const updatedAllColumns = [
      ...data.slice(0, columnIndex),
      updatedCurrentColumn,
      ...data.slice(columnIndex + 1),
    ];

    setData(updatedAllColumns);
  };

  return (
    <>
      <div className="grid-container-header">
        {leftColumn.showColumn && (
          <div className="grid-col-header">
            <div className="header-delete-btn">
              <Button
                block
                style={{ height: "100%" }}
                icon={
                  <DeleteOutlined style={{ fontSize: "12px", color: "gray" }} />
                }
                type="text"
                onClick={hideLeftCol}
              />
            </div>
          </div>
        )}
        {rightColumn.showColumn && (
          <div className="grid-col-header">
            <div className="header-delete-btn">
              <Button
                block
                style={{ height: "100%" }}
                icon={
                  <DeleteOutlined style={{ fontSize: "12px", color: "gray" }} />
                }
                type="text"
                onClick={hideRightCol}
              />
            </div>
          </div>
        )}

        {!bothColsOpen() && (
          <div className="header-last-btn">
            <Button
              style={{ height: "100%", border: "none" }}
              icon={<PlusCircleOutlined style={{ fontSize: "12px" }} />}
              onClick={showColumn}
            />
          </div>
        )}
      </div>
      <div className="grid-container">
        {leftColumn.showColumn && <GridColumn cellIDs={leftColumn.cellIDs} addRow={updateLeftCells}/>}
        {rightColumn.showColumn && <GridColumn cellIDs={rightColumn.cellIDs} addRow={updateRightCells}/>}
      </div>
    </>
  );
}

export default ContentGridV2;
