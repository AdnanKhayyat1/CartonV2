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
    initCells: (cells) => set((state) => ({state, cells})),
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
  const [cells, setCells, initCells] = useCellStore((state) => [
    state.cells,
    state.updateCells,
    state.initCells,
  ]);

  const updateLeftCells = useObjectStore((state) => state.addCellToLeftColumn);
  const updateRightCells = useObjectStore(
    (state) => state.addCellToRightColumn
  );
  const allCells = leftColumn.cellIDs.concat(rightColumn.cellIDs);

  const { isLoading, isError, data, isSuccess } = useQuery(
    ["cells", allCells],
    () => CellApi.getCellsByIds(allCells), {
      onSuccess: (data) => {
        if(data) {
          setCells(data);
        }
      }
    }

  );

  useEffect(() => {
    if (isSuccess) {
      initCells(data);
    }
  }, [isSuccess]);

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

  const createLeftCell =  useMutation({
    mutationFn: CellApi.createCell,
    onSuccess: (data) => {
      const newCell = data.data;
      setCells(newCell);
      updateLeftCells(newCell._id);
    },
  });

  const createRightCell = useMutation({
    mutationFn: CellApi.createCell,
    onSuccess: (data) => {
      const newCell = data.data;
      setCells(newCell);
      updateRightCells(newCell._id);
    },
  });
  const _filterCells = (cellIds) => {
    return cells.filter((cell) => cellIds.includes(cell._id));
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
        {leftColumn.showColumn && (
          <GridColumn
            cells={_filterCells(leftColumn.cellIDs)}
            addRow={() => createLeftCell.mutate()}
          />
        )}
        {rightColumn.showColumn && (
          <GridColumn
            cells={_filterCells(rightColumn.cellIDs)}
            addRow={() => createRightCell.mutate()}
          />
        )}
      </div>
    </>
  );
}

export default ContentGridV2;
