import React, { useCallback } from "react";
import { Handle, Position } from "reactflow";
const handleStyle = { left: 10 };


function BlockNode({ data }) {


  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        Block
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}

export default BlockNode;
