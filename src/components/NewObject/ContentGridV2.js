import React, { useState, useEffect } from "react";
import { Button } from "antd";

import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "./newObject.css";
import GridColumn from "./GridColumn";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { useObjectStore } from "./NewObject";
import { devtools } from "zustand/middleware";
import { useQuery } from "react-query";
import { CellApi } from "../../api/cellApi";
import { useMutation } from "react-query";

export const useCellStore = create(
  devtools((set) => ({
    cells: [],
    initCells: (cells) => set((state) => ({ state, cells })),
    updateCells: (newCells) =>
      set((state) => ({ cells: [...state.cells, newCells] })),
    updateCellById: (id, newCellData) => {
      set((state) => ({
        cells: state.cells.map((cell) =>
          cell._id === id ? { ...cell, data: newCellData } : cell
        ),
      }));
    },
  }))
);

function ContentGridV2() {
  const [leftColumn, setLeftColumn] = useObjectStore((state) => [
    state.leftColumn,
    state.updateLeftColumn,
  ]);
  const [rightColumn, setRightColumn] = useObjectStore((state) => [
    state.rightColumn,
    state.updateRightColumn,
  ]);
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
    () => CellApi.getCellsByIds(allCells),
    {
      onSuccess: (data) => {
        if (data) {
          setCells(data);
        }
      },
    }
  );

  useEffect(() => {
    if (isSuccess) {
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
    const response = await createCell.mutateAsync(key);
    if (response.data) {
      const newCell = response.data;

      setCells(newCell);
      if (column === "left") {
        updateLeftCells(newCell._id);
      } else {
        updateRightCells(newCell._id);
      }
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
              <Button
                block
                icon={<DeleteOutlined style={{ color: "gray" }} />}
                style={{ height: "100%", padding: "0px", margin: "0 auto" }}
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
                icon={<DeleteOutlined style={{ color: "gray" }} />}
                style={{ height: "100%", padding: "0px", margin: "0 auto" }}
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
