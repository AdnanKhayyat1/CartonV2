import React, { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function ObjectNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);


  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        Object Node
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

export default ObjectNode;
