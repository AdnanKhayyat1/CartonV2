import React, { useState } from "react";
import { Button } from "antd";

import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "./newObject.css";
import GridColumn from "./GridColumn";
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
  const [isDoubleCols, setIsDoubleCols] = useState(false);
  const [data, setData] = useState(initialCols);
  const [numCells, setNumCells] = useState(2);

  const showColumn = () => {
    setData(data.map((col) => ({ ...col, showCol: true })));
    setIsDoubleCols(true);
  };

  const hideCol = (e) => {
    const id = e.currentTarget.id;
    const updatedColumns = data.map((col) => {
      if (col.id === id) {
        return {
          ...col,
          showCol: false,
        };
      }
      return col;
    });
    setIsDoubleCols(false);

    setData(updatedColumns);
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
        {data.map(
          (column) =>
            column.showCol && (
              <div className="grid-col-header">
                <div className="header-delete-btn">
                  <Button
                    block
                    style={{ height: "100%" }}
                    id={column.id}
                    icon={
                      <DeleteOutlined
                        style={{ fontSize: "12px", color: "gray" }}
                      />
                    }
                    type="text"
                    onClick={hideCol}
                  />
                </div>
              </div>
            )
        )}
        {!isDoubleCols && (
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
        {data.map((column) => {
          return (
            column.showCol && (
              <GridColumn
                key={column.id}
                id={column.id}
                cells={column.cells}
                addRow={addRow}
              />
            )
          );
        })}
      </div>
    </>
  );
}

export default ContentGridV2;
