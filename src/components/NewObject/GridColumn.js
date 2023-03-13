import React, { useEffect } from "react";
import { Dropdown, Button } from "antd";
import GridRow from "./GridRow";
import { CellApi } from "../../api/cellApi";
import { useQuery, useMutation } from "react-query";
import { useObjectStore } from "./NewObject";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
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
const useCellStore = create((set) => ({
  cells: [],
  updateCells: (cells) => set(() => ({ cells: cells })),
  getCellById: (id) =>
    set((state) => ({ cells: state.cells.find((cell) => cell._id === id) })),
}));

function GridColumn({ cellIDs, addRow }) {
  const { isLoading, isError, data, isSuccess } = useQuery(
    ["cells", cellIDs],
    () => CellApi.getCellsByIds(cellIDs)
  );
  const createCell = useMutation({
    mutationFn: CellApi.createCell,
    onSuccess: (data) => {
      const newCell = data.data;
      setCells([...cells, newCell]);
      addRow(newCell._id);
    },
  });
  const [cells, setCells] = useCellStore(
    (state) => [state.cells, state.updateCells],
    shallow
  );

  const onClick = async ({ key }) => {
    const newCell = {
      type: key,
      order: cells.length === 0 ? 0 : cells[cells.length - 1].order + 1,
      data: {},
    };
    createCell.mutate(newCell);
  };
  useEffect(() => {
    if (cellIDs && cellIDs.length > 0) {
      setCells(data);
    }
  }, [isSuccess]);
  if (isLoading) {
    return <div></div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div className="grid-column">
      {cells &&
        cells.map((cell) => <GridRow key={cell.id} id={cell.id} cell={cell} />)}
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

export default GridColumn;
