import React, { useState, useEffect } from "react";
import { Button } from "antd";

import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "./newObject.css";
import GridColumn from "./GridColumn";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { useObjectStore } from "../stores/objectStore";
import { devtools } from "zustand/middleware";
import { useQuery } from "react-query";
import { CellApi } from "../../api/cellApi";
import { useMutation } from "react-query";
import { ObjectApi } from "../../api/objectApi";
import { useCellStore } from "../stores/cellStore";
function ContentGridV2() {
  const objectID = useObjectStore((state) => state._id, shallow);
  const [leftColumn, setLeftColumn] = useObjectStore(
    (state) => [state.leftColumn, state.updateLeftColumn],
    shallow
  );
  const [rightColumn, setRightColumn] = useObjectStore(
    (state) => [state.rightColumn, state.updateRightColumn],
    shallow
  );
  const [cells, setCells, initCells] = useCellStore(
    (state) => [state.cells, state.updateCells, state.initCells],
    shallow
  );

  const updateLeftCells = useObjectStore((state) => state.addCellToLeftColumn);
  const updateRightCells = useObjectStore(
    (state) => state.addCellToRightColumn
  );
  const allCells = leftColumn.cellIDs.concat(rightColumn.cellIDs);

  const { isLoading, isError, data, isSuccess } = useQuery(
    ["cells", allCells],
    () => CellApi.getCellsByIds(allCells)
  );

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      initCells(data);
    }
  }, [isSuccess]);

  const bothColsOpen = () => {
    return leftColumn.showColumn && rightColumn.showColumn;
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

  const createCell = useMutation((type) => CellApi.createCell({ mode: type }));

  const _filterCells = (cellIds) => {
    return cells.filter((cell) => cellIds.includes(cell._id));
  };
  const addCell = async (key, column = "left") => {
    try {
      const response = await createCell.mutateAsync(key);
      if (response.data) {
        const newCell = response.data;
        setCells(newCell);

        const currentCellIDs =
          column === "left" ? leftColumn.cellIDs : rightColumn.cellIDs;
        const newCellIDs = [...currentCellIDs, newCell._id];
        if (column === "left") {
          const res = await ObjectApi.updateObject({
            _id: objectID,
            leftCol: {
              ...leftColumn,
              cellIDs: newCellIDs,
            },
          });
          if (!res) throw new Error("Couldnt add cell to left object");
          updateLeftCells(newCell._id);
        } else {
          const res = await ObjectApi.updateObject({
            _id: objectID,
            rightCol: {
              ...rightColumn,
              cellIDs: newCellIDs,
            },
          });
          if (!res) throw new Error("Couldnt add cell to right object");
          updateRightCells(newCell._id);
        }
      } else {
        throw new Error("Cell creation failed!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  return (
    <>
      <div className="grid-container-header">
        {leftColumn.showColumn && (
          <div className="grid-col-header">
            <div className="header-delete-btn">
              <DeleteOutlined
                style={{
                  color: "gray",
                  padding: "0px",
                  margin: "0 auto",
                }}
                onClick={hideLeftCol}
              />
            </div>
          </div>
        )}
        {rightColumn.showColumn && (
          <div className="grid-col-header">
            <div className="header-delete-btn">
              <DeleteOutlined
                style={{
                  color: "gray",
                  padding: "0px",
                  margin: "0 auto",
                }}
                onClick={hideRightCol}
              />
            </div>
          </div>
        )}

        {!bothColsOpen() && (
          <PlusCircleOutlined className="add-button" onClick={showColumn} />
        )}
      </div>
      <div className="grid-container">
        {leftColumn.showColumn && (
          <GridColumn
            cells={_filterCells(leftColumn.cellIDs)}
            addRow={(type) => addCell(type, "left")}
          />
        )}
        {rightColumn.showColumn && (
          <GridColumn
            cells={_filterCells(rightColumn.cellIDs)}
            addRow={(type) => addCell(type, "right")}
          />
        )}
      </div>
    </>
  );
}

export default ContentGridV2;
