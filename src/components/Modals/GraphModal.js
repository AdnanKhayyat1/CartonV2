import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  UpOutlined,
  ForkOutlined,
  MehOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { Button, Modal, Tooltip, Space, Typography } from "antd";

import { CellApi } from "../../api/cellApi";
import { ObjectApi } from "../../api/objectApi";
import { useAuthStore } from "../stores/authStore";
import './Graph.css';

import "reactflow/dist/style.css";
import ForceGraph2D from "react-force-graph-2d";
function GraphModal({ graphModalHandler, isGraphModal }) {
  const userID = useAuthStore((state) => state.userID);
  const [graphReady, setGraphReady] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const navigate = useNavigate();
  const fgRef = useRef();
  useEffect(() => {
    initGraph();
  }, []);

  const initGraph = async () => {
    try {
      const objects = await ObjectApi.getObjects(userID);
      if (!objects) throw new Error("Couldnt fetch objects");
      const cellsToFetch = [];
      const objectEdges = [];

      const objectNodes = objects.map((object) => {
        // get left cell ids to fetch
        if (object.leftCol.cellIDs.length > 0) {
          object.leftCol.cellIDs.forEach((cellID) => {
            cellsToFetch.push({cellID: cellID, parent: object._id});
            objectEdges.push({
              id: `${object._id}-${cellID}`,
              source: object._id,
              target: cellID,
            });
          });
        }
        // get right cell ids to fetch
        if (object.rightCol.cellIDs.length > 0) {
          object.rightCol.cellIDs.forEach((cellID) => {
            cellsToFetch.push({cellID: cellID, parent: object._id});
            objectEdges.push({
              id: `${object._id}-${cellID}`,
              source: object._id,
              target: cellID,
            });
          });
        }

        return {
          id: object._id,
          position: { x: 0, y: 0 },
          type: "object",
          label: !!object.title ? object.title : 'Untitled',
          icon: ['📘', '📙', '📕', '📒', '📓'][parseInt(object._id) % 4]
        };
      });

      // fetch cells
      const cellIDToFetch = cellsToFetch.map((cell) => cell.cellID)
      const cells = await CellApi.getCellsByIds(cellIDToFetch);
      if (!cells) throw new Error("Couldnt fetch cells");

      // add node for each cell

      const cellNodes = cells.map((cell, index) => {
        return {
          id: cell._id,
          position: { x: 0, y: 0 },
          type: "block",
          label: !!cell.title ? cell.title : 'Untitled',
          icon: '📝',
          parent: cellsToFetch[index].parent,
        };
      });
      setNodes([...objectNodes, ...cellNodes]);
      setEdges(objectEdges);
      setGraphReady(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Modal
      open={isGraphModal}
      onCancel={graphModalHandler}
      onOk={graphModalHandler}
      width={700}
      footer={null}
      closeIcon={<CloseOutlined style={{color:"white"}}/>}
      
    >
      {graphReady && (
          <ForceGraph2D
            graphData={{
              nodes: nodes,
              links: edges,
            }}
            ref={fgRef}

            cooldownTicks={100}
            onEngineStop={() => fgRef.current.zoomToFit(400,100)}
            
            width={700}
            height={700}
            onNodeClick={(node, event) => {
                if(node.type === 'block'){
                    navigate(`/newobject/${node.parent}`)
                } else {
                    navigate(`/newobject/${node.id}`)
                }
                graphModalHandler();
            }}
            backgroundColor={'#343A42'}
   
            nodeCanvasObject={(node, ctx, globalScale) => {
              ctx.beginPath(); 
              ctx.fillStyle = node.type === 'block' ? '#866EE0' : '#FFFFFF';
              ctx.arc(node.x, node.y, 2 * globalScale, 0, 2 * Math.PI, false); 
              
              ctx.fill(); 
              const label = node.label;
              const fontSize = 1.5 * globalScale;
              ctx.font = `${fontSize}px Inter`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'white';
              ctx.fillText(node.icon, node.x, node.y);
              ctx.fillText(label, node.x, node.y + (3 * globalScale));
            }}
          />
    
      )}
    </Modal>
  );
}

export default GraphModal;
